'use client';

import { motion } from 'framer-motion';
import { Mail, Download, Eye, Calendar, Search, Filter, Trash2, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ExportRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  country: string;
  productInterest?: string | null;
  quantity?: string | null;
  message?: string | null;
  notes?: string | null;
  assignedTo?: string | null;
  status: 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'QUOTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
  respondedAt?: string | null;
}

interface AdminExportRequestsProps {
  initialData?: ExportRequest[];
}

export function AdminExportRequests({ initialData = [] }: AdminExportRequestsProps) {
  const [requests, setRequests] = useState<ExportRequest[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'QUOTED' | 'COMPLETED' | 'CANCELLED'>('all');
  const [selectedRequest, setSelectedRequest] = useState<ExportRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  // Refetch function for after mutations
  const refetchRequests = async () => {
    try {
      const response = await fetch('/api/export-requests', { credentials: 'include' });
      if (response.ok) {
        const responseData = await response.json();
        setRequests(Array.isArray(responseData.data) ? responseData.data : []);
      }
    } catch (err) {
      console.error('Failed to refetch requests:', err);
    }
  };

  const handleStatusChange = async (id: string, status: ExportRequest['status']) => {
    try {
      const response = await fetch(`/api/export-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      // Update local state
      const updated = requests.map(req =>
        req.id === id ? { ...req, status } : req
      );
      setRequests(updated);
      
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }

      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await fetch(`/api/export-requests/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete request');
      }

      toast({
        title: 'Success',
        description: 'Request deleted successfully',
      });

      // Refresh the list
      await refetchRequests();
      
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete request',
        variant: 'destructive',
      });
    }
  };

  const handleExportToExcel = async () => {
    try {
      // Dynamic import of xlsx
      const XLSX = await import('xlsx');
      
      const data = filteredRequests.map(req => ({
        Company: req.companyName,
        Contact: req.contactName,
        Email: req.email,
        Phone: req.phone || 'N/A',
        Country: req.country,
        Products: req.productInterest || 'N/A',
        Message: req.message || 'N/A',
        'Submitted At': new Date(req.createdAt).toLocaleString(),
        Status: req.status,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Export Requests');
      XLSX.writeFile(wb, `export-requests-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel. Please try again.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      (req.contactName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.country || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ExportRequest['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-700';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-700';
      case 'QUOTED':
        return 'bg-indigo-100 text-indigo-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const openDetailModal = (request: ExportRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Export Requests</h1>
            <p className="text-sm text-gray-500">Manage customer export inquiries</p>
          </div>
        </div>
        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
        >
          <Download className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTED">Quoted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">New Requests</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
              {requests.filter(r => r.status === 'NEW').length}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Contacted</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
              {requests.filter(r => r.status === 'CONTACTED').length}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Completed</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
              {requests.filter(r => r.status === 'COMPLETED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.contactName}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{request.companyName}</div>
                      <div className="text-sm text-gray-500">{request.country}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value as ExportRequest['status'])}
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(request.status)} border-0 focus:ring-2 focus:ring-[#2d7a3e]`}
                    >
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUOTED">Quoted</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDetailModal(request)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No requests found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Export requests from customers will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl text-gray-900">Request Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.contactName}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <a href={`mailto:${selectedRequest.email}`} className="text-sm text-blue-600 hover:underline">
                    {selectedRequest.email}
                  </a>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <a href={`tel:${selectedRequest.phone}`} className="text-sm text-blue-600 hover:underline">
                    {selectedRequest.phone || 'N/A'}
                  </a>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Company</label>
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.companyName}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.country}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Submitted</label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Products Interested In</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.productInterest || 'Not specified'}
                </p>
              </div>

              {selectedRequest.quantity && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Requested Quantity</label>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg font-medium">
                    {selectedRequest.quantity}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1">Message</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedRequest.message || 'No message'}
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Internal Notes</label>
                <textarea
                  value={selectedRequest.notes || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, notes: e.target.value })}
                  placeholder="Add internal notes about this request..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value as ExportRequest['status'])}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedRequest.status)} border-0 focus:ring-2 focus:ring-[#2d7a3e]`}
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUOTED">Quoted</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/export-requests/${selectedRequest.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes: selectedRequest.notes }),
                        credentials: 'include',
                      });
                      if (!response.ok) throw new Error('Failed to save notes');
                      toast({ title: 'Success', description: 'Notes saved successfully' });
                      await refetchRequests();
                    } catch {
                      toast({ title: 'Error', description: 'Failed to save notes', variant: 'destructive' });
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Save Notes
                </button>
                <a
                  href={`mailto:${selectedRequest.email}?subject=Re: Export Inquiry from ${selectedRequest.companyName}&body=Dear ${selectedRequest.contactName},%0D%0A%0D%0AThank you for your interest in our products.%0D%0A%0D%0ABest regards,%0D%0AAl-Rehab Group for Export`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2d7a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1d5a2e] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
