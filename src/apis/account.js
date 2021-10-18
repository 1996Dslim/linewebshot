import service from '../services/request';

const AccountApi = {
  getUser(id) {
    return service.get(`/user/${id}`);
  },
  registerUser(remoteId, data) {
    return service.post(`/user/${remoteId}`, JSON.stringify(data));
  },
  saveUser(id, data) {
    return service.put(`/user/${id}`, JSON.stringify(data));
  },
  deleteUser(id) {
    return service.delete(`/user/${id}`);
  },
};

export default AccountApi;
