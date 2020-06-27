<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Invoice;
use App\Customer;
use Illuminate\Support\Facades\DB;
use App\Item;
use App\InvoiceItem;

class InvoiceController extends Controller
{
    public function GetInvoices(Request $request)
    {
        $search = $request->input('search', '');
        $customers = new Customer();
        $invoices = new Invoice();
        if ($search != '') {
            if(ctype_digit($search)){
                $invoices = $invoices->where('id', 'LIKE', $search.'%')->with('customer')->get();
            }else{
                $customers = $customers->where('name', 'LIKE', '%'.$search.'%')->get('id');
                $customers_id_array = [];
                for($x=0; $x < count($customers); $x++){
                    $customers_id_array[$x] = $customers[$x]->id ;
                }

                $invoices = $invoices->whereIn('customer_id',$customers_id_array)->with('customer')->get();
            }
        }
        else{
            $invoices = $invoices->with('customer')->get();
        }

        $invoicesNarray = [
            'invoices' => $invoices,
        ];

        return $invoicesNarray;
    }

    public function GetInvoice(Request $request, $id)
    {
        return Invoice::with('customer')->with('invoiceitems')->findOrfail($id);
    }

    public function GetPreviousInvoice($id){
        // dd(Invoice::with('customer')->with('invoiceitems')->latest()->get());
        if($id > 1){

            return Invoice::with('customer')->with('invoiceitems')->where('id', '<', $id)->orderBy('id', 'DESC')->first();
        }
        else{

            return Invoice::with('customer')->with('invoiceitems')->get()->last();
        }

    }

    public function GetLastInvoice(){
        return Invoice::with('customer')->with('invoiceitems')->orderBy('id', 'DESC')->first();
    }


    public function GetNextInvoice($id){
        if($id == Invoice::with('customer')->with('invoiceitems')->get()->last()->id){

            return Invoice::with('customer')->with('invoiceitems')->get()->first();
        }
        else{


            return Invoice::with('customer')->with('invoiceitems')->where('id', '>', $id)->orderBy('id')->first();
        }

    }

    public function AddInvoice(Request $request)
    {
        if(!$request->pure_debt){
            $request->validate([
                'total_amount' => 'bail|required|integer|gte:payed_amount',
                'customer_id' => 'bail|nullable|integer',
                'payed_amount' => 'bail|required|integer|min:0',
            ]);
        }

        if ($request->has('items')) {

            $request->validate([
                'items.*.id' => 'bail|required|numeric',
                'items.*.count' => 'bail|nullable|numeric',
            ]);
        }

        //if customer is -1 invoice should fully paid
        // return json_encode($request->customer_id == false);
        if ($request->customer_id == -1) {
            if ($request->input('total_amount') != $request->input('payed_amount')) {
                http_response_code(500);
                return "normal customer should always pay full amount";
            }
        }

        if ($request->customer_id != -1) {
            $customer = Customer::findOrfail($request->input('customer_id'));
        }


        DB::beginTransaction();
        $invoice = new Invoice();
        $invoice->customer_id = $request->customer_id;
        if($request->pure_debt){
            $invoice->total_amount = $request->pure_debt;
            $invoice->payed_amount = 0;
            $invoice->remaining_amount = $request->pure_debt;
        }
        else{
            $invoice->total_amount = $request->input('total_amount');
            $invoice->payed_amount = $request->input('payed_amount');
            $invoice->remaining_amount = $request->input('total_amount') - $request->input('payed_amount');
            $invoice->total_cost = $request->input('total_cost');
        }
        if ($invoice->total_amount == $invoice->payed_amount ) {
            $invoice->is_fully_paid = true;
        } else {
            $invoice->is_fully_paid = false;
        }
        if (!$invoice->save()){
            DB::rollBack();
            http_response_code(500);
            return "can't save invoice";
        }

        if ($request->customer_id != -1) {
            $customer->credit = ($invoice->total_amount - $invoice->payed_amount) + $customer->credit;
            if (!$customer->save()){
                DB::rollBack();
                http_response_code(500);
                return "can't save customer cridet";
            }
        }



        if (!$request->items) {
            // DB::rollBack();
            // http_response_code(500);
            // return "there must be items";
            DB::commit();
            http_response_code(200);
            return ['invoice' => $invoice,'invoice_items' => []];
        }

        $arrayOfIds = [];

        foreach ($request->input('items') as $key => $item) {
            $arrayOfIds[] = $item['id'];
        }
        //get all items
        $items = Item::whereIn('id', $arrayOfIds)->get();
        if (count($items) != count($arrayOfIds)) {
            DB::rollBack();
            http_response_code(500);
            return "missing item";
        }

        //check if total price match
        $totalPrice = 0;
        foreach($items as $itemFromDb){
            foreach ($request->input('items') as $itemFromRequest) {
                if ($itemFromDb['id'] == $itemFromRequest['id']) {
                   $totalPrice += $itemFromRequest['count'] * $itemFromDb['sell_price'];
                }
            }
        }


        if ($totalPrice != $request->input('total_amount')) {
            DB::rollBack();
            http_response_code(500);
            return "wrong totalPrice Sent";
        }


        $invoice_items = [];
        foreach($items as $itemFromDb){
            foreach ($request->input('items') as $itemFromRequest) {
                if ($itemFromDb['id'] == $itemFromRequest['id']) {
                    $invoiceItem = new InvoiceItem();
                    $invoiceItem->invoice_id = $invoice->id;
                    $invoiceItem->item_id = $itemFromDb['id'];
                    $invoiceItem->name = $itemFromDb['name'];
                    $invoiceItem->barcode = $itemFromDb['barcode'];
                    $invoiceItem->buy_price = $itemFromDb['buy_price'];
                    $invoiceItem->sell_price = $itemFromDb['sell_price'];

                    $invoiceItem->count = $itemFromRequest['count'];
                    $invoiceItem->sub_price = $itemFromRequest['count'] * $itemFromDb['sell_price'];
                    $invoiceItem->sub_cost = $itemFromRequest['count'] * $itemFromDb['buy_price'];
                    array_push($invoice_items,$invoiceItem);
                    if (!$invoiceItem->save()){
                        DB::rollBack();
                        http_response_code(500);
                        return "can't add item to invoice items";
                    }
                }
            }
        }

        DB::commit();
        http_response_code(200);
        return ['invoice' => $invoice,'invoice_items' => $invoice_items];
    }
    public function UpdateInvoice(Request $request)
    {
        // dd($request);
        // return $request->input('payed_amount');
        $request->validate([
            'total_amount' => 'bail|required|integer|gte:payed_amount',
            'customer_id' => 'bail|nullable|integer',
            'payed_amount' => 'bail|required|integer|min:0',
        ]);

        if ($request->has('items')) {

            $request->validate([
                'items.*.id' => 'bail|required|numeric',
                'items.*.count' => 'bail|nullable|numeric',
            ]);
        }

        //if customer is -1 invoice should fully paid
        if ($request->customer_id == -1) {
            if ($request->input('total_amount') != $request->input('payed_amount')) {
                http_response_code(500);
                return "normal customer should always pay full amount";
            }
        }

        if ($request->customer_id != -1) {
            $customer = Customer::findOrfail($request->input('customer_id'));
        }


        DB::beginTransaction();
        $invoice = Invoice::findOrfail($request->input('invoice_id'));
        $invoice->customer_id = $request->input('customer_id');
        $invoice->total_amount = $request->input('total_amount');
        $invoice->payed_amount = $request->input('payed_amount');
        $invoice->remaining_amount = $request->input('total_amount') - $request->input('payed_amount');
        $invoice->total_cost = $request->input('total_cost');
        if ($request->input('total_amount') == $request->input('payed_amount')) {
            $invoice->is_fully_paid = true;
        } else {
            $invoice->is_fully_paid = false;
        }
        if (!$invoice->save()){
            DB::rollBack();
            http_response_code(500);
            return "can't save invoice";
        }

        if ($request->customer_id != -1) {
            $customerInvoices = Invoice::where('customer_id',$request->customer_id)->get();
            // $customer->credit = (($request->input('total_amount') - $request->input('payed_amount'))) + $customer->credit;
            // $customer->credit =
            $remaining_amount_sum = 0;
            for($x = 0; $x < count($customerInvoices); $x++){
                $remaining_amount_sum += $customerInvoices[$x]->remaining_amount;
            }
            $customer->credit = $remaining_amount_sum;
            if (!$customer->save()){
                DB::rollBack();
                http_response_code(500);
                return "can't save customer cridet";
            }
        }


        if (!$request->items) {
            // DB::rollBack();
            // http_response_code(500);
            // return "there must be items";
            DB::commit();
            http_response_code(200);
            return ['invoice' => $invoice,'invoice_items' => []];
        }

        $arrayOfIds = [];

        foreach ($request->input('items') as $key => $item) {
            $arrayOfIds[] = $item['id'];
        }
        //get all items
        $items = Item::whereIn('id', $arrayOfIds)->get();
        if (count($items) != count($arrayOfIds)) {
            DB::rollBack();
            http_response_code(500);
            return "missing item";
        }

        //check if total price match


        $invoice_items = [];

        foreach($items as $itemFromDb){
            foreach ($request->input('items') as $itemFromRequest) {
                if ($itemFromDb['id'] == $itemFromRequest['id']) {
                    $invoice_item_id=$itemFromRequest['invoice_item_id'];
                    $invoiceItem = InvoiceItem::findOrfail($invoice_item_id);
                    $invoiceItem->count = $itemFromRequest['count'];
                    $invoiceItem->sub_price = $itemFromRequest['count'] * $itemFromDb['sell_price'];
                    $invoiceItem->sub_cost = $itemFromRequest['count'] * $itemFromDb['buy_price'];
                    array_push($invoice_items,$invoiceItem);
                    if (!$invoiceItem->save()){
                        DB::rollBack();
                        http_response_code(500);
                        return "can't add item to invoice items";
                    }
                }
            }
        }

        $arrayOfNewIds = [];

        foreach ($request->input('newItems') as $item) {
            $arrayOfNewIds[] = $item['id'];
        }
        //get all items
        $newItems = Item::whereIn('id', $arrayOfNewIds)->get();
        if (count($newItems) != count($arrayOfNewIds)) {
            DB::rollBack();
            http_response_code(500);
            return "missing item";
        }

        foreach($newItems as $itemFromDb){
            foreach ($request->input('newItems') as $itemFromRequest) {
                if($itemFromDb['id'] == $itemFromRequest['id']){
                    $invoiceItem = new InvoiceItem();
                    $invoiceItem->invoice_id = $invoice->id;
                    $invoiceItem->item_id = $itemFromDb['id'];
                    $invoiceItem->name = $itemFromDb['name'];
                    $invoiceItem->barcode = $itemFromDb['barcode'];
                    $invoiceItem->buy_price = $itemFromDb['buy_price'];
                    $invoiceItem->sell_price = $itemFromDb['sell_price'];

                    $invoiceItem->count = $itemFromRequest['count'];
                    $invoiceItem->sub_price = $itemFromRequest['count'] * $itemFromDb['sell_price'];
                    $invoiceItem->sub_cost = $itemFromRequest['count'] * $itemFromDb['buy_price'];
                    array_push($invoice_items,$invoiceItem);
                    if (!$invoiceItem->save()){
                        DB::rollBack();
                        http_response_code(500);
                        return "can't add item to invoice items";
                    }

                }
            }
        }

        $totalPrice = 0;
        foreach($newItems as $itemFromDb){
            foreach ($request->input('newItems') as $itemFromRequest) {
                if ($itemFromDb['id'] == $itemFromRequest['id']) {
                   $totalPrice += $itemFromRequest['count'] * $itemFromDb['sell_price'];
                }
            }
        }
        foreach($items as $itemFromDb){
            foreach ($request->input('items') as $itemFromRequest) {
                if ($itemFromDb['id'] == $itemFromRequest['id']) {
                   $totalPrice += $itemFromRequest['count'] * $itemFromDb['sell_price'];
                }
            }
        }

        if ($totalPrice != $request->input('total_amount')) {
            DB::rollBack();
            http_response_code(500);
            return "wrong totalPrice Sent";
        }

        if(count($request->input('removed_items')) != 0){
            InvoiceItem::whereIn('id' , $request->input('removed_items'))->delete();
        }



        DB::commit();
        http_response_code(200);
        return ['invoice' => $invoice,'invoice_items' => $invoice_items];
    }


    public function RemoveInvoiceItem($id){
        // InvoiceItem::where('id' , $id)->delete();

    }


    public function payFixedAmount(Request $request)
    {

        // $request->validate([
        //     'customer_id' => 'bail|required|integer',
        //     'amount' => 'bail|required|integer|min:1',
        // ]);


        // $customer = Customer::findOrfail($request->input('customer_id'));


        // $payedAmount = $request->input('amount');
        // $originalPayedAmount = $payedAmount;
        // $invoices = Invoice::where('customer_id', $request->input('customer_id'))
        // ->where('is_fully_paid', false)->get();


        // $invoiceToUpdate = [];
        // foreach ($invoices as $key => $invoice) {

        //     if ($invoice->remaining_amount == $payedAmount) {
        //         $invoice->remaining_amount = 0;
        //         $invoice->payed_amount = $invoice->total_amount;
        //         $invoice->is_fully_paid = true;
        //         $invoiceToUpdate[] = $invoice;
        //         $payedAmount = 0;
        //         break;
        //     }
        //     else if ($invoice->remaining_amount < $payedAmount) {
        //         $payedAmount = $payedAmount - $invoice->remaining_amount;
        //         $invoice->remaining_amount = 0;
        //         $invoice->payed_amount = $invoice->total_amount;
        //         $invoice->is_fully_paid = true;
        //         $invoiceToUpdate[] = $invoice;
        //     }
        //     else if ($invoice->remaining_amount > $payedAmount) {
        //         $invoice->remaining_amount = $invoice->remaining_amount - $payedAmount;
        //         $invoice->payed_amount = $invoice->payed_amount + $payedAmount;
        //         $invoice->is_fully_paid = false;
        //         $invoiceToUpdate[] = $invoice;
        //         $payedAmount = 0;
        //         break;
        //     }
        // }


        // if ($payedAmount == $request->input('amount')) {
        //     http_response_code(400);
        //     return ['nothing_to_pay'];
        // }
        // if ($payedAmount > ($customer->credit * -1)) {
        //     http_response_code(400);
        //     return ['customer_payed_more', $customer->credit];
        // }
        // if ($payedAmount != 0){
        //     http_response_code(400);
        //     return ['conflict'];
        // }



        // DB::beginTransaction();

        // try {

        //     foreach ($invoiceToUpdate as $invoice) {
        //         $invoice->save();
        //     }
        // } catch(\Exception $e)
        // {
        //     DB::rollback();
        //     throw $e;
        // }

        // try {
        //     $customer->credit = $customer->credit + $originalPayedAmount;
        //     $customer->save();
        // } catch(\Exception $e)
        // {
        //     DB::rollback();
        //     throw $e;
        // }


        // DB::commit();

        // return;

    }

    public function PrintInvoice(Request $request){
        $time = strtotime($request->invoice['created_at']);
        $newTime = date('d/m/y',$time);
        $fileContent = file_get_contents(app_path()."\invoice.html") ;

        $fileContent = str_replace("##invoice_id", $request->invoice['id'], $fileContent);
        $fileContent = str_replace("##invoice_date", $newTime, $fileContent);
        $fileContent = str_replace("##total_amount", $request->invoice['total_amount'], $fileContent);
        $fileContent = str_replace("##payed_amount", $request->invoice['payed_amount'], $fileContent);
        $fileContent = str_replace("##remaining_amount", $request->invoice['remaining_amount'], $fileContent);
        if($request->customerName){
            $fileContent = str_replace("##customer_name", $request->customerName, $fileContent);
        }else{
            $fileContent = str_replace("##customer_name", "غير مسجل", $fileContent);
        }


        $itemsHtml = "";
        for ($x = 0; $x < count($request->invoice_items); $x++) {
            $itemsHtml .= '
            <div style="display: flex;flex-direction:row-reverse;padding: 0;width:100%">
                <div style="width:50%;">'.$request->invoice_items[$x]['name'].'</div>
                <div style="width:16.66%;">'.$request->invoice_items[$x]['sell_price'].'</div>
                <div style="width:16.66%;">'.$request->invoice_items[$x]['count'].'</div>
                <div style="width:16.66%;">'.$request->invoice_items[$x]['sub_price'].'</div>
            </div>';
        }
        $fileContent = str_replace("##items", $itemsHtml, $fileContent);

        return $fileContent;
    }


}
