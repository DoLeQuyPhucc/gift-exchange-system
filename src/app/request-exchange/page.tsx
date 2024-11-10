"use client"

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Package, MessageCircle, Check, X, SendHorizontal, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/format-date';

interface Request {
  id: string;
  item_id: string;
  requester_id: string;
  quantity: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  message: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  owner_id: string;
  item_image: string;
  requester_name: string;
  requester_image: string;
}

const RequestCard = ({ request, onApprove, loading }: { 
  request: Request; 
  onApprove: (id: string) => void;
  loading: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex gap-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
      <div className="w-48 h-48 flex-shrink-0">
        <img
          src={request.item_image}
          alt={request.item_name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {request.item_name}
            </h3>
            <Badge className={`mt-2 ${getStatusColor(request.status)}`}>
              {request.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDate(request.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={request.requester_image}
            alt={request.requester_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{request.requester_name}</p>
            <p className="text-sm text-gray-500">ID: {request.requester_id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <MessageCircle className="h-4 w-4 text-orange-500" />
          <p>{request.message}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>Quantity: {request.quantity}</span>
          </div>
          <div>
            <span>Owner ID: {request.owner_id}</span>
          </div>
        </div>

        {request.status === 'Pending' && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => onApprove(request.id)}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const RequestList = () => {
  const userId = localStorage.getItem('userId') ?? '';
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const response = await fetch('https://672f062d229a881691f19ad9.mockapi.io/api/requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error("Failed to load requests. Please try again later.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://672f062d229a881691f19ad9.mockapi.io/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Approved',
          updated_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setRequests(requests.map(request => 
          request.id === requestId 
            ? { ...request, status: 'Approved', updated_at: new Date().toISOString() }
            : request
        ));
        toast.success("Request approved successfully");
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const myRequests = requests.filter(request => request.requester_id === userId);
  const requestsToMe = requests.filter(request => request.requester_id !== userId);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* My Requests Section */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserCircle className="h-6 w-6" />
            Các yêu cầu của tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {myRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Bạn chưa gửi yêu cầu nào</p>
          ) : (
            myRequests.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onApprove={handleApprove}
                loading={loading}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Requests To Me Section */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <SendHorizontal className="h-6 w-6" />
            Các yêu cầu được gửi tới tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {requestsToMe.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có yêu cầu nào được gửi tới bạn</p>
          ) : (
            requestsToMe.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onApprove={handleApprove}
                loading={loading}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestList;