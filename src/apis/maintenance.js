import service from '../services/request';

const MaintenanceApi = {
  findByCorp(corpId, params) {
    return service.get(`/maintenance/company/${corpId}`, params);
  },
  findByMold(moldId, params) {
    return service.get(`/maintenance/mold/${moldId}`, params);
  },
  findHistoryByMold(moldId) {
    return service.get(`/maintenance/mold/${moldId}/hist`);
  },
  get(id) {
    return service.get(`/maintenance/${id}`);
  },
  save(data, id) {
    if (id && id !== -1) {
      return service.put(`/maintenance/${id}`, JSON.stringify(data));
    }

    return service.post("/maintenance", JSON.stringify(data));
  },
  delete(id) {
    return service.delete(`/maintenance/${id}`);
  }
};

export default MaintenanceApi;
