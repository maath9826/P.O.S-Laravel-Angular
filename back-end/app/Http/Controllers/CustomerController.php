<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Customer;
use App\Invoice;

class CustomerController extends Controller
{
    public function GetCustomers(Request $request)
    {
        $search = $request->input('search', '');
        $customers = new Customer;
        if ($search != '') {
            $customers = $customers->where('name', 'LIKE', '%'.$search.'%')->get();
        }else{
            $customers = $customers->all();
        }

        $customersNcount = [
            'customers'=> $customers,
            'count'=> $customers->count()
        ];

        return $customersNcount;
    }

    public function GetSpecCustomers(Request $request)
    {
        $search = $request->input('search', '');
        $customers = new Customer;
        if ($search != '') {
            $customers = $customers->where('name', 'LIKE', '%'.$search.'%')->take(10)->get();
        }else{
            $customers = $customers->take(10)->get();
        }

        $customersNcount = [
            'customers'=> $customers,
            'count'=> $customers->count()
        ];

        return $customersNcount;
    }

    public function GetCustomer(Request $request, $id)
    {
        return Customer::findOrfail($id);
    }

    public function AddCustomer(Request $request)
    {

        $request->validate([
            'name' => 'bail|required',
            'phone' => 'bail|required|regex:/[0-9]{9}/'
        ]);

        $customer = new Customer;
        $customer->name = $request->input('name');
        $customer->phone = $request->input('phone');
        // $customer->credit = $request->input('credit');
        if ($customer->save()) {
            http_response_code(200);
            return $customer;
        }
        else {
            http_response_code(201);
            return "";
        }
    }

    public function UpdateCustomer(Request $request, $id)
    {
        $request->validate([
            'name' => 'bail|required',
            'phone' => 'bail|required|regex:/[0-9]{9}/'
        ]);
        $customer = Customer::findOrfail($id);
        $customer->name = $request->input('name');
        $customer->phone = $request->input('phone');
        if ($customer->save()) {
            return $customer;
        }
        else {
            http_response_code(500);
            return "";
        }
    }

    public function payDebt(Request $request){
        $customerInvoices = Invoice::where('customer_id', $request['customer_id'])->get();
        $customer = Customer::findOrfail($request['customer_id']);
        if($customer['credit'] != 0 && $request['payed_debt'] > 0){
            if($request['payed_debt'] >= $customer->credit){
                $customer->credit = 0;
            }else{
                $customer->credit -=  $request['payed_debt'];
            }
            $customer->save();
        }

        for($x = 0; $x < count($customerInvoices); $x++ ){
            if($request['payed_debt'] > $customerInvoices[$x]->remaining_amount){
                $request['payed_debt'] -= $customerInvoices[$x]->remaining_amount;
                $customerInvoices[$x]->payed_amount = $customerInvoices[$x]->total_amount;
                $customerInvoices[$x]->remaining_amount = 0;
                $customerInvoices[$x]->save();
            }else{
                $customerInvoices[$x]->remaining_amount -=  $request['payed_debt'];
                $request['payed_debt'] = 0;
                $customerInvoices[$x]->payed_amount = $customerInvoices[$x]->total_amount - $customerInvoices[$x]->remaining_amount;
                $customerInvoices[$x]->save();
            }
        }

    }
}
