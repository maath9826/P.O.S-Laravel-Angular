<?php

namespace App\Http\Controllers;

use App\Invoice;
use App\InvoiceItem;
use Illuminate\Http\Request;
use App\Item;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    public function GetItems(Request $request)
    {
        $search = $request->input('search', '');
        $items = new Item();
        if($request->selectedRadioOption == 'المحذوفات'){
            if ($search != '') {
                if (ctype_digit($search)) {
                    if (strlen($search) < 5) {
                        $items = $items->where('barcode', 'LIKE', $search.'%')->onlyTrashed()->get();
                    } else {
                        $items = $items->where('barcode','LIKE', $search.'%')->onlyTrashed()->get();
                    }
                }
                else {
                    $items = $items->where('name', 'LIKE', '%'.$search.'%')->onlyTrashed()->get();
                }
            }
            else{
                $items = $items->onlyTrashed()->get();
            }
        }
        else{
            if ($search != '') {
                if (ctype_digit($search)) {
                    if (strlen($search) < 5) {
                        $items = $items->where('barcode', 'LIKE', $search.'%')->get();
                    } else {
                        $items = $items->where('barcode','LIKE', $search.'%')->get();
                    }
                }
                else {
                    $items = $items->where('name', 'LIKE', '%'.$search.'%')->get();
                }
            }
            else{
                $items = $items->get();
            }
        }

        $itemsNcount = [
            'items'=> $items,
            'count'=> $items->count()
        ];
        return $itemsNcount;
    }

    public function GetSpecItems(Request $request)
    {
        $search = $request->input('search', '');
        $items = new Item();
        if ($search != '') {
            // if (ctype_digit($search)) {
            //     if (strlen($search) < 5) {
            //         $items = $items->where('barcode', 'LIKE', $search.'%')->take(10)->get();
            //     } else {
            //         $items = $items->where('barcode','LIKE', $search.'%')->take(10)->get();
            //     }
            // }
            // else {
                $items = $items->where('name', 'LIKE', '%'.$search.'%')->take(10)->get();
            // }
        }
        else{
            $items = $items->take(10)->get();
        }
        $itemsNcount = [
            'items'=> $items,
            'count'=> $items->count()
        ];
        // return  $itemsNcount;
        // if($itemsNcount->count() == 0){
        //     $itemsNcount = null;
        // }
        return $itemsNcount;
    }
    public function GetItemsOnEnter(Request $request)
    {
        $search = $request->input('search', '');
        $items = new Item();
        if ($search != '') {
            if (ctype_digit($search)) {
                if (strlen($search) < 5) {
                    $items = $items->where('barcode', 'LIKE', $search.'%')->take(10)->get();
                } else {
                    $items = $items->where('barcode','LIKE', $search.'%')->take(10)->get();
                }
            }
        }
        $itemsNcount = [
            'items'=> $items,
            'count'=> $items->count()
        ];
        return $itemsNcount;
    }

    public function GetItem(Request $request, $id)
    {
        return Item::findOrfail($id);
    }

    public function AddItem(Request $request)
    {
        $request->validate([
            'name' => 'bail|required',
            'barcode' => 'bail|nullable|numeric',
            'buy_price' => 'bail|required|numeric',
            'sell_price' => 'bail|required|numeric|gt:buy_price',
            'quantity' => 'bail|nullable|numeric',
        ]);

        $item = new Item;
        $item->name = $request->input('name');
        $item->buy_price = $request->input('buy_price');
        $item->sell_price = $request->input('sell_price');

        if ($request->input('quantity') || $request->input('quantity') === "0") {
            $item->quantity = $request->input('quantity');
        }else{
            $item->quantity = -1;
        }

        if ($request->has('barcode') && $request->input('barcode')) {
            $item->barcode = $request->input('barcode');
        } else {
            $item->barcode = round(microtime(true) * 1000);
        }

        if ($item->save()) {
            http_response_code(200);
            return $item;
        }
        else {
            http_response_code(500);
            return "";
        }
    }

    public function UpdateItem(Request $request)
    {
        // return $request->input('sell_price');
        $request->validate([
            'name' => 'bail|required',
            'barcode' => 'bail|numeric',
            'buy_price' => 'bail|required|numeric',
            'sell_price' => 'bail|required|numeric',
            'quantity' => 'bail|nullable|numeric',
        ]);
        if(!($request->input('sell_price') > $request->input('buy_price'))){
            http_response_code(500);
            return "the sell_price must be greater than buy_price";
        }
        DB::beginTransaction();

        $item = Item::findOrfail($request->input('id'));

        $item->name = $request->input('name');
        $item->buy_price = $request->input('buy_price');
        $item->sell_price = $request->input('sell_price');

        if ($request->input('quantity') || $request->input('quantity') === "0") {
            $item->quantity = $request->input('quantity');
        }else{
            $item->quantity = -1;
        }

        if ($request->has('barcode')) {
            $item->barcode = $request->input('barcode');
        } else {
            $item->barcode = round(microtime(true) * 1000);
        }

        if (!$item->save()) {
            DB::rollBack();
            http_response_code(500);
            return "can't save item";
        }


        // $invoiceItems = InvoiceItem::where('item_id',$request->input('id'))->get();



        // foreach ($invoiceItems as $invoiceItemDB) {

        //         $invoice_item_id=$invoiceItemDB['id'];
        //         $invoiceItem = InvoiceItem::findOrfail($invoice_item_id);
        //         $invoiceItem->name = $item['name'];
        //         $invoiceItem->buy_price = $item['buy_price'];
        //         $invoiceItem->sell_price = $item['sell_price'];
        //         $invoiceItem->barcode = $item['barcode'];
        //         $invoiceItem->count = $invoiceItemDB['count'];
        //         $invoiceItem->sub_price = $invoiceItem['count'] * $item['sell_price'];
        //         if (!$invoiceItem->save()){
        //             DB::rollBack();
        //             http_response_code(500);
        //             return "can't save invoice item";
        //         }

        // }

        DB::commit();
        http_response_code(200);
        return $item;
    }

    public function deleteItem(Request $request){
        Item::where('id',$request['item_id'])->delete();
    }

    public function restoreItem(Request $request){
        Item::where('id',$request['id'])->restore();
    }

}
