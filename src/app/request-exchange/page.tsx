"use client"

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Package, MessageCircle, Check, X, SendHorizontal, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/format-date';
import axiosInstance from '../api/axiosInstance';

interface Request {
  id: string;
  item_id: string;
  item_image: string;
  item_name: string[];
  quantity: number;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string;
  requester_id: string;
  requester_name: string;
  requester_image: string;
  recipient_id: string,
  recipient_name: string,
  recipient_image: string,
}

const RequestCard = ({ request, onApprove, onReject, loading, isMyRequest }: { 
  request: Request; 
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
  isMyRequest: boolean;
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
          src={request.item_image[0]}
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
          <div className="flex items-center gap-4">
          <img
            src={request.recipient_image}
            alt={request.recipient_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{request.recipient_name}</p>
          </div>
        </div>
        </div>
        { !isMyRequest && request.status === 'Pending' && (
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
              onClick={() => onReject(request.id)}
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
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [requestsForMe, setRequestsForMe] = useState<Request[]>([]);

  const [loading, setLoading] = useState(false);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const my_request = await axiosInstance.get('/request/my-requests');
      setMyRequests(my_request.data.data);

      const request_for_me = await axiosInstance.get('/request/requests-for-me');
      setRequestsForMe(request_for_me.data.data);
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
      const response = await axiosInstance.post(`/request/approve/${requestId}`);
      if (response.data.isSuccess) {
        toast.success("Request approved successfully");
        fetchRequests();
      } else {
        throw new Error(response.data.message || "Failed to approve request");
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/request/reject/${requestId}`);
      if (response.data.isSuccess) {
        toast.success("Request rejected successfully");
        fetchRequests();
      } else {
        throw new Error(response.data.message || "Failed to reject request");
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                onReject={handleReject}
                loading={loading}
                isMyRequest={true}
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
          {requestsForMe.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có yêu cầu nào được gửi tới bạn</p>
          ) : (
            requestsForMe.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onApprove={handleApprove}
                onReject={handleReject}
                loading={loading}
                isMyRequest={false}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestList;