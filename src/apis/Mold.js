import service from '../services/request';

const Mold = {
  searchMolds(id, params) {
    return service.get(`/company/${id}/molds`, { params: params });
  },
  searchUnmatchingMolds(id) {
    return service.get(`/company/${id}/molds/unmatching`);
  },
  searchMoldCounters(id) {
    return service.get(`/company/${id}/mold/counters`);
  },
  searchMoldsByPaging(id, params) {
    return service.get(`/company/${id}/mold`, { params: params });
  },
  checkDuplicateMold(params) {
    return service.get(`/mold/duplicate`, { params: params });
  },
  getMold(id) {
    return service.get(`/mold/${id}`);
  },
  getMoldCommInfo(id) {
    return service.get(`/mold/${id}/communication`);
  },
  saveMold(data, id) {
    if (id) {
      return service.put(`/mold/${id}`, JSON.stringify(data));
    }
    return service.post(`/mold`, JSON.stringify(data));
  },
  deleteMold(id) {
    return service.delete(`/mold/${id}`);
  },
  getCustomByMold(id) {
    return service.get(`/mold/${id}/moldcustom`);
  },
  saveMoldCustom(data) {
    return service.post(`/moldcustom`, JSON.stringify(data));
  },
  getMoldCustomValues(customCodeId) {
    return service.get(`/customcd/${customCodeId}/moldcustom`);
  },
};

export default Mold;
