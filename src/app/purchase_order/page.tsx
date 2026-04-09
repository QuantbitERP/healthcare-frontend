'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, Package } from 'lucide-react';
import CreatePurchaseOrderModal from './components/CreatePurchaseOrderModal';
// import { useAuth } from '@/context/AuthContext';
import { FRAPPE_CONFIG } from '@/config/frappe';

interface DashboardMetrics {
  totalOrders: number;
  monthlySpend: number;
  onTimeDelivery: number;
  draftOrders: number;
  submittedOrders: number;
}

interface PurchaseOrder {
  name: string;
  supplier: string;
  status: string;
  posting_date: string;
  schedule_date: string;
  grand_total: number;
  docstatus: number;
}

const PurchaseOrderPage: React.FC = () => {
  // const { currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    monthlySpend: 0,
    onTimeDelivery: 0,
    draftOrders: 0,
    submittedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard metrics
  const fetchDashboardMetrics = async () => {
    try {
      const response = await fetch(`${FRAPPE_CONFIG.BASE_URL}/api/method/quantbit_ury_customization.ury_customization.purchase_order_api.get_dashboard_metrics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.message);
      } else {
        console.error('API response not OK:', response.status);
        // Set default values on error
        setMetrics({
          totalOrders: 0,
          monthlySpend: 0,
          onTimeDelivery: 0,
          draftOrders: 0,
          submittedOrders: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      // Set default values on error
      setMetrics({
        totalOrders: 0,
        monthlySpend: 0,
        onTimeDelivery: 0,
        draftOrders: 0,
        submittedOrders: 0,
      });
    }
  };

  // Fetch purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${FRAPPE_CONFIG.BASE_URL}/api/method/quantbit_ury_customization.ury_customization.purchase_order_api.get_purchase_orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPurchaseOrders(data.message);
      } else {
        console.error('API response not OK:', response.status);
        setPurchaseOrders([]);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
    fetchPurchaseOrders();
  }, []);

  // Filter purchase orders
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'draft' && order.docstatus === 0) ||
                         (statusFilter === 'submitted' && order.docstatus === 1);
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string, docstatus: number) => {
    if (docstatus === 0) {
      return <Badge variant="secondary">Draft</Badge>;
    } else if (docstatus === 1) {
      return <Badge variant="default">Submitted</Badge>;
    } else {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">Manage your purchase orders and supplier relationships</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Purchase Order
        </Button>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.draftOrders} Draft, {metrics.submittedOrders} Submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.monthlySpend)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.onTimeDelivery}%</div>
            <p className="text-xs text-muted-foreground">Delivery performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.draftOrders + metrics.submittedOrders}</div>
            <p className="text-xs text-muted-foreground">Draft + Submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/suppliers'}>
            <Package className="w-4 h-4 mr-2" />
            View Suppliers
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/inventory'}>
            <Package className="w-4 h-4 mr-2" />
            View Inventory
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading purchase orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">PO Number</th>
                      <th className="text-left py-3 px-4">Supplier</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Order Date</th>
                      <th className="text-left py-3 px-4">Expected Delivery</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No purchase orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.name}</td>
                        <td className="py-3 px-4">{order.supplier}</td>
                        <td className="py-3 px-4">{getStatusBadge(order.status, order.docstatus)}</td>
                        <td className="py-3 px-4">{order.posting_date}</td>
                        <td className="py-3 px-4">{order.schedule_date}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(order.grand_total)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

      {/* Create Purchase Order Modal */}
      {showCreateModal && (
        <CreatePurchaseOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPurchaseOrders();
            fetchDashboardMetrics();
          }}
        />
      )}
    </div>
  );
};

export default PurchaseOrderPage;
