import React, { useState } from 'react';
import { X, Package, MapPin, CreditCard, Truck, CheckCircle2, Clock, AlertCircle, ChevronLeft, Printer, Download, Mail, MessageSquare } from 'lucide-react';
import { Order } from '../types.ts';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: Order['status']) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose, onUpdateStatus }) => {
  const [notes, setNotes] = useState<string>('');
  const getStatusIcon = () => {
    switch (order.status) {
      case 'PAID':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Orders
        </button>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Order Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Status Header */}
        <div className={`px-6 py-4 border-b ${getStatusColor()} flex justify-between items-center`}>
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-xl font-bold">{order.id}</h2>
              <p className="text-sm opacity-90">Order placed on {order.date}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor()}`}>
            {order.status}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-sm text-gray-500">Customer since 2023</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {Array.from({ length: order.items }).map((_, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Product Item {idx + 1}</p>
                        <p className="text-sm text-gray-500">Quantity: 1</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(order.total / order.items).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Shipping Address</p>
                  <p className="text-sm text-gray-600">123 Main Street, City, State 12345</p>
                </div>
              </div>
              {order.status === 'SHIPPED' && (
                <div className="flex items-start space-x-3 pt-2 border-t border-gray-200">
                  <Truck className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Tracking Number</p>
                    <p className="text-sm text-gray-600">TRACK{order.id.replace('#ORD-', '')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Payment Method</p>
                  <p className="text-sm text-gray-600">Credit Card ending in 4242</p>
                  {order.status === 'PAID' && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                      Paid on {order.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Order Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Add internal notes about this order..."
            />
            <p className="mt-1 text-xs text-gray-500">Private notes visible only to you</p>
          </div>

          {/* Actions */}
          {onUpdateStatus && (
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                {order.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(order.id, 'PAID')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </button>
                    <button
                      onClick={() => onUpdateStatus(order.id, 'SHIPPED')}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Mark as Shipped
                    </button>
                  </>
                )}
                {order.status === 'PAID' && (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'SHIPPED')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Shipped
                  </button>
                )}
                {order.status === 'SHIPPED' && (
                  <div className="flex-1 text-center text-sm text-gray-500 py-2">
                    Order has been shipped
                  </div>
                )}
              </div>
              <button
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Customer Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
