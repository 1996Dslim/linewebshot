import service from '../services/request';

const ApprovalApi = {
  getApprovalRequestsByCorp(corpId) {
    return service.get(`/company/${corpId}/approvals`);
  },
  getApprovedRequestsByCorp(corpId, deviceType) {
    return service.get(`/company/${corpId}/approvals/${deviceType}`);
  },
  getApprovedRequestsRestDeviceByCorp(corpId, deviceType) {
    return service.get(`/company/${corpId}/approvals/rest/${deviceType}`);
  },
  searchNoPresetApprovedMoldCounter(corpId) {
    return service.get(`/company/${corpId}/approvals/nopreset/counter`);
  },
  getApprovalRequest(id) {
    return service.get(`/approval/${id}`);
  },
  getApprovalRequestByCondition(deviceType, deviceId) {
    const params = { deviceId: deviceId };
    return service.get(`/approval/${deviceType}`, { params: params });
  },
  saveRequest(data, id) {
    if (id) {
      return service.put(`/approval/${id}`, JSON.stringify(data));
    }
    return service.post(`/approval`, JSON.stringify(data));
  },
  deleteRequest(id) {
    return service.delete(`/approval/${id}`);
  },
  disposeOfApprovalRequest(id, userId, action) {
    if (id && userId && action) {
      return service.put(`/approval/${id}/${action}`, userId);
    }
  },
};

export default ApprovalApi;
