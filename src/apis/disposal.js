import service from '../services/request';

const DisposalApi = {
  findByCorp(corpId) {
    return service.get(`/disposal/company/${corpId}`);
  },
  findByMold(moldId) {
    return service.get(`/disposal/mold/${moldId}`);
  },
  get(id) {
    return service.get(`/disposal/${id}`);
  },
  save(data, id) {
    if (id) {
      return service.put(`/disposal/${id}`, JSON.stringify(data));
    }
    return service.post("/disposal", JSON.stringify(data));
  },
  delete(id) {
    return service.delete(`/disposal/${id}`);
  }
};

export default DisposalApi;
