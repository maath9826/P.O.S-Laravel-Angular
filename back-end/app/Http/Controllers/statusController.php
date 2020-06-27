<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Invoice;
use App\InvoiceItem;
use Illuminate\Http\Request;
use App\Item;
use Illuminate\Support\Facades\DB;

class statusController extends Controller
{
    public function specificStatus(Request $request){
        if($request['startDate'] && $request['endDate']){
            // items
            $weekItems = Item::whereBetween('created_at', [$request['startDate'], $request['endDate']])->get('id');
            $itemsCount = count($weekItems);

            // invoices

            $weekInvoices = Invoice::whereBetween('created_at', [$request['startDate'], $request['endDate']])->get('id');
            $invoicesCount = count($weekInvoices);

            //  income

            $weekIncomeInvoices = Invoice::whereBetween('created_at', [$request['startDate'], $request['endDate']])->get();
            $income = 0;
            $debt = 0;
            $weekCost = 0;
            $allTimeDebt = 0;
            foreach($weekIncomeInvoices as $invoice){
                if($invoice['is_fully_paid'] == 0){
                    $income += $invoice['total_amount'];
                    $debt += $invoice['remaining_amount'];
                    $weekCost += $invoice['total_cost'];
                }else{
                    $income += $invoice['total_amount'];
                    $weekCost += $invoice['total_cost'];
                }
            }
            $gain = $income - $weekCost;
            $debtIgnorance = $gain - $debt ;

            $allCustomers = Customer::all();
            foreach($allCustomers as $customer){
                $allTimeDebt += $customer['credit'];
            }

                // $weekIncomeInvoices = Invoice::all();
                // foreach($weekIncomeInvoices as $invoice){
                //     if($invoice['is_fully_paid'] == 0){
                //         $allTimeDebt += $invoice['remaining_amount'];
                //     }
                // }

        }else{
                // items
                $previous_week = strtotime("-1 week +1 day");
                $start_week = strtotime("last sunday midnight",$previous_week);
                $end_week = strtotime("next saturday",$start_week);
                $start_week = date("Y-m-d",$start_week);
                $end_week = date("Y-m-d",$end_week);

                $weekItems = Item::whereBetween('created_at', [$start_week, $end_week])->get('id');

                $itemsCount = count($weekItems);

                // invoices

                $weekInvoices = Invoice::whereBetween('created_at', [$start_week, $end_week])->get('id');

                $invoicesCount = count($weekInvoices);

                //  income , debt , gain

                $weekIncomeInvoices = Invoice::whereBetween('created_at', [$start_week, $end_week])->get();
                $income = 0;
                $debt = 0;
                $weekCost = 0;
                $allTimeDebt = 0;
                foreach($weekIncomeInvoices as $invoice){
                    if($invoice['is_fully_paid'] == 0){
                        $income += $invoice['total_amount'];
                        $debt += $invoice['remaining_amount'];
                        $weekCost += $invoice['total_cost'];
                    }else{
                        $income += $invoice['total_amount'];
                        $weekCost += $invoice['total_cost'];
                    }
                }
                $gain = $income - $weekCost;
                $debtIgnorance = $gain - $debt ;

                $allCustomers = Customer::all();
                foreach($allCustomers as $customer){
                    $allTimeDebt += $customer['credit'];
                }
                // $weekIncomeInvoices = Invoice::all();
                // foreach($weekIncomeInvoices as $invoice){
                //     if($invoice['is_fully_paid'] == 0){
                //         $allTimeDebt += $invoice['remaining_amount'];
                //     }
                // }
        }

        return [ 'itemsCount' => $itemsCount, 'invoicesCount' => $invoicesCount, 'income' => $income, 'debt' => $debt, 'gain' => $gain, 'debtIgnorance' => $debtIgnorance, 'allTimeDebt' => $allTimeDebt];
    }

    public function chartStatus(Request $request){
        // charts
        // ------------
        if($request['interval'] == 'اسبوع'){
            // invoices
            $previous_week = strtotime("-1 week +1 day");
            $startDate = strtotime("last sunday midnight",$previous_week);
            $invoicesChartData = [] ;
            $gainChartData = [] ;
            $debtIgnorance = 0;
            $income = 0;
            $weekCost = 0;

            for($x = 1; $x <= 7; $x++){
            $endDate = strtotime("+1 day", $startDate);

            $startDate = date("Y-m-d",$startDate);
            $endDate = date("Y-m-d",$endDate);

            $day_Invoices = Invoice::whereBetween('created_at', [ $startDate, $endDate])->get();

            foreach($day_Invoices as $invoice){
                if($invoice['is_fully_paid'] == 0){
                    $income += $invoice['total_amount'];
                    $weekCost += $invoice['total_cost'];
                }else{
                    $income += $invoice['total_amount'];
                    $weekCost += $invoice['total_cost'];
                }
            }
            $debtIgnorance = $income - $weekCost ;
            $income = 0;
            $weekCost = 0;

            array_push($gainChartData,$debtIgnorance);
            array_push($invoicesChartData,count($day_Invoices));

            $startDate = $endDate;
            $startDate = strtotime($startDate);


            }

            return [ 'invoicesChartData' => $invoicesChartData, 'gainChartData' => $gainChartData ];

            // gain

        }else
        if($request['interval'] == 'شهر'){
            // invoices
            $previous_month = strtotime("-1 month");
            $startDate = strtotime("first day of this month",$previous_month);
            $invoicesChartData = [] ;
            $gainChartData = [] ;
            $debtIgnorance = 0;
            $income = 0;
            $weekCost = 0;

            for($x = 1; $x <= 4; $x++){
                $endDate = strtotime("+1 week",$startDate);

                $startDate = date("Y-m-d",$startDate);
                $endDate = date("Y-m-d",$endDate);

                $day_Invoices = Invoice::whereBetween('created_at', [ $startDate, $endDate])->get('id');

                foreach($day_Invoices as $invoice){
                    if($invoice['is_fully_paid'] == 0){
                        $income += $invoice['total_amount'];
                        $weekCost += $invoice['total_cost'];
                    }else{
                        $income += $invoice['total_amount'];
                        $weekCost += $invoice['total_cost'];
                    }
                }
                $debtIgnorance = $income - $weekCost ;
                $income = 0;
                $weekCost = 0;

                array_push($gainChartData,$debtIgnorance);
                array_push($invoicesChartData,count($day_Invoices));

                $startDate = $endDate;
                $startDate = strtotime($startDate);
                }

            return [ 'invoicesChartData' => $invoicesChartData, 'gainChartData' => $gainChartData ];
            // gain
        }else if($request['interval'] == 'سنة'){
            // invoices
            $previous_year = strtotime("-1 year");
            $startDate = strtotime("1 january",$previous_year);
            $invoicesChartData = [] ;
            $gainChartData = [] ;
            $debtIgnorance = 0;
            $income = 0;
            $weekCost = 0;

            for($x = 1; $x <= 12; $x++){
                $endDate = strtotime("+1 month",$startDate);

                $startDate = date("Y-m-d",$startDate);
                $endDate = date("Y-m-d",$endDate);

                $day_Invoices = Invoice::whereBetween('created_at', [ $startDate, $endDate])->get('id');

                foreach($day_Invoices as $invoice){
                    if($invoice['is_fully_paid'] == 0){
                        $income += $invoice['total_amount'];
                        $weekCost += $invoice['total_cost'];
                    }else{
                        $income += $invoice['total_amount'];
                        $weekCost += $invoice['total_cost'];
                    }
                }
                $debtIgnorance = $income - $weekCost ;
                $income = 0;
                $weekCost = 0;

                array_push($gainChartData,$debtIgnorance);
                array_push($invoicesChartData,count($day_Invoices));

                $startDate = $endDate;
                $startDate = strtotime($startDate);
                }

            return [ 'invoicesChartData' => $invoicesChartData, 'gainChartData' => $gainChartData ];
            // gain
        }


    }
}
