'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { FRAPPE_CONFIG } from '@/config/frappe';

interface OrderItem {
  id: string;
  item_code: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  discount_type: string;
  discount_percentage: number;
  discount_amount: number;
  total: number;
  notes: string;
}

interface OrderDetails {
  po_number: string;
  supplier: string;
  status: string;
  order_date: string;
  expected_delivery_date: string;
  tax_amount: number;
  shipping_cost: number;
  payment_status: string;
  notes: string;
}

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'items'>('details');
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    po_number: '',
    supplier: '',
    status: 'Draft',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    tax_amount: 0,
    shipping_cost: 0,
    payment_status: 'Pending',
    notes: ''
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Fetch suppliers and items on mount
  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
      fetchItems();
      generatePONumber();
    }
  }, [isOpen]);

  const generatePONumber = async () => {
    try {
      const response = await fetch(`${FRAPPE_CONFIG.BASE_URL}/api/method/quantbit_ury_customization.ury_customization.purchase_order_api.get_next_po_number`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(prev => ({ ...prev, po_number: data.message }));
      }
    } catch (error) {
      console.error('Error generating PO number:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${FRAPPE_CONFIG.BASE_URL}/api/method/quantbit_ury_customization.ury_customization.purchase_order_api.get_suppliers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.message || []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`${FRAPPE_CONFIG.BASE_URL}/api/method/quantbit_ury_customization.ury_customization.purchase_order_api.get_items`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.message || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addNewItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      item_code: '',
      item_name: '',
      quantity: 0,
      unit_price: 0,
      discount_type: 'No discount',
      discount_percentage: 0,
      discount_amount: 0,
      total: 0,
      notes: ''
    };
    setOrderItems([...orderItems, newItem]);
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Update item_name when item_code changes
        if (field === 'item_code') {
          const selectedItem = items.find(i => i.name === value);
          if (selectedItem) {
            updatedItem.item_name = selectedItem.item_name;
            updatedItem.unit_price = selectedItem.opening_stock || 0;
          }
        }
        
        // Calculate total
        const subtotal = updatedItem.quantity * updatedItem.unit_price;
        let discountAmount = 0;
        
        if (updatedItem.discount_type === 'Percentage') {
          discountAmount = subtotal * (updatedItem.discount_percentage / 100);
        } else if (updatedItem.discount_type === 'Fixed') {
          discountAmount = updatedItem.discount_amount;
        }
        
        updatedItem.total = subtotal - discountAmount;
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateOrderSummary = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const totalDiscount = orderItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unit_price;
      let discount = 0;
      if (item.discount_type === 'Percentage') {
        discount = itemSubtotal * (item.discount_percentage / 100);
      } else if (item.discount_type === 'Fixed') {
        discount = item.discount_amount;
      }
      return sum + discount;
    }, 0);
    
    const afterDiscount = subtotal - totalDiscount;
    const tax = orderDetails.tax_amount;
    const shipping = orderDetails.shipping_cost;
    const total = afterDiscount + tax + shipping;
    
    return {
      subtotal,
      totalDiscount,
      afterDiscount,
      tax,
      shipping,
      total
    };
  };

  const handleCreatePO = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!orderDetails.supplier) {
        alert('Please select a supplier');
        return;
      }
      
      if (orderItems.length === 0) {
        alert('Please add at least one item');
        return;
      }
      
      if (orderItems.some(item => !item.item_code || item.quantity <= 0)) {
        alert('Please ensure all items have valid selection and quantity');
        return;
      }

      const payload = {
        supplier: orderDetails.supplier,
        price_list: 'Standard Buying',                        // Now has all required item prices
        posting_date: orderDetails.order_date,
        schedule_date: orderDetails.expected_delivery_date,
        tax_amount: orderDetails.tax_amount,
        shipping_cost: orderDetails.shipping_cost,
        notes: orderDetails.notes,
        items: orderItems.map(item => ({
          item_code: item.item_code,
          qty: item.quantity,
          rate: item.unit_price,
          discount_percentage: item.discount_percentage,
          discount_amount: item.discount_amount,
          description: item.notes
        }))
      };

      const response = await fetch(`${FRAPPE_CONFIG.BASE_URL}/api/method/quantbit_ury_customization.ury_customization.purchase_order_api.create_purchase_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.message && result.message.success) {
        alert('Purchase Order created successfully!');
        onSuccess();
        onClose();
      } else {
        alert(result.message?.error || 'Failed to create Purchase Order');
      }
    } catch (error) {
      console.error('Error creating PO:', error);
      alert('Failed to create Purchase Order');
    } finally {
      setLoading(false);
    }
  };

  const summary = calculateOrderSummary();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create New Purchase Order</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'details' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Order Details
            </button>
            <button
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'items' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600'
              }`}
              onClick={() => setActiveTab('items')}
            >
              Items ({orderItems.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="po_number">PO Number</Label>
                  <Input
                    id="po_number"
                    value={orderDetails.po_number}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select
                    value={orderDetails.supplier}
                    onValueChange={(value) => setOrderDetails(prev => ({ ...prev, supplier: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.name} value={supplier.name}>
                          {supplier.supplier_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={orderDetails.status}
                    onValueChange={(value) => setOrderDetails(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="order_date">Order Date</Label>
                  <Input
                    id="order_date"
                    type="date"
                    value={orderDetails.order_date}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, order_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
                  <Input
                    id="expected_delivery_date"
                    type="date"
                    value={orderDetails.expected_delivery_date}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select
                    value={orderDetails.payment_status}
                    onValueChange={(value) => setOrderDetails(prev => ({ ...prev, payment_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tax_amount">Tax Amount</Label>
                  <Input
                    id="tax_amount"
                    type="number"
                    value={orderDetails.tax_amount}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, tax_amount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="shipping_cost">Shipping Cost</Label>
                  <Input
                    id="shipping_cost"
                    type="number"
                    value={orderDetails.shipping_cost}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, shipping_cost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for this purchase order..."
                  value={orderDetails.notes}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Order Items</h3>
                <Button onClick={addNewItem} className="bg-yellow-500 hover:bg-yellow-600">
                  <Plus className="w-4 h-4 mr-2" />
                  {orderItems.length === 0 ? 'Add First Item' : 'Add Item'}
                </Button>
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No items added yet. You must add at least one item to create a purchase order.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-3">
                            <Label>Ingredient</Label>
                            <Select
                              value={item.item_code}
                              onValueChange={(value) => updateItem(item.id, 'item_code', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ingredient" />
                              </SelectTrigger>
                              <SelectContent>
                                {items.map(item_option => (
                                  <SelectItem key={item_option.name} value={item_option.name}>
                                    {item_option.item_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              min="0"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Unit Price</Label>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              min="0"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Discount Type</Label>
                            <Select
                              value={item.discount_type}
                              onValueChange={(value) => updateItem(item.id, 'discount_type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="No discount">No discount</SelectItem>
                                <SelectItem value="Percentage">Percentage</SelectItem>
                                <SelectItem value="Fixed">Fixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Total</Label>
                            <div className="font-semibold">KSh {item.total.toLocaleString()}</div>
                          </div>
                          
                          <div className="col-span-1 flex items-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {item.discount_type !== 'No discount' && (
                          <div className="mt-4 grid grid-cols-12 gap-4">
                            <div className="col-span-3">
                              <Label>
                                {item.discount_type === 'Percentage' ? 'Discount %' : 'Discount Amount'}
                              </Label>
                              <Input
                                type="number"
                                value={item.discount_type === 'Percentage' ? item.discount_percentage : item.discount_amount}
                                onChange={(e) => updateItem(
                                  item.id, 
                                  item.discount_type === 'Percentage' ? 'discount_percentage' : 'discount_amount',
                                  parseFloat(e.target.value) || 0
                                )}
                                min="0"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Item notes..."
                            value={item.notes}
                            onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">KSh {summary.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span className="font-semibold">KSh {summary.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="font-semibold">KSh {summary.shipping.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>KSh {summary.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePO} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Creating...' : 'Create PO'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;
