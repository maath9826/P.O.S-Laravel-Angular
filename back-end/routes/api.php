<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('Customers/GetCustomers', 'CustomerController@GetCustomers');
Route::get('Customers/GetSpecCustomers', 'CustomerController@GetSpecCustomers');
Route::post('Customers/AddCustomer', 'CustomerController@AddCustomer');
Route::post('Customers/payDebt', 'CustomerController@payDebt');
Route::get('Customers/{id}/GetCustomer', 'CustomerController@GetCustomer');
Route::post('Customers/{id}/UpdateCustomer', 'CustomerController@UpdateCustomer');

Route::get('Invoices/GetInvoices', 'InvoiceController@GetInvoices');
Route::get('Invoices/GetLastInvoice', 'InvoiceController@GetLastInvoice');
Route::post('Invoices/AddInvoice', 'InvoiceController@AddInvoice');
Route::post('Invoices/UpdateInvoice', 'InvoiceController@UpdateInvoice');
Route::post('Invoices/PrintInvoice', 'InvoiceController@PrintInvoice');
Route::get('Invoices/{id}/GetInvoice', 'InvoiceController@GetInvoice');
Route::get('Invoices/{id}/GetPreviousInvoice', 'InvoiceController@GetPreviousInvoice');
Route::get('Invoices/{id}/GetNextInvoice', 'InvoiceController@GetNextInvoice');
// Route::post('Invoices/RemoveInvoice/{id}', 'InvoiceController@RemoveInvoiceItem');
Route::post('Invoices/PayFixedAmount', 'InvoiceController@payFixedAmount');

Route::get('Items/GetItems', 'ItemController@GetItems');
Route::get('Items/GetSpecItems', 'ItemController@GetSpecItems');
Route::get('Items/GetItemsOnEnter', 'ItemController@GetItemsOnEnter');
Route::post('Items/AddItem', 'ItemController@AddItem');
Route::post('Items/UpdateItem', 'ItemController@UpdateItem');
Route::post('Items/deleteItem', 'ItemController@deleteItem');
Route::post('Items/restoreItem', 'ItemController@restoreItem');
Route::get('Items/{id}/GetItem', 'ItemController@GetItem');

// status
Route::get('status/specific', 'statusController@specificStatus');
Route::get('status/chart', 'statusController@chartStatus');
