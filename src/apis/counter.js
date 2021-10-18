import service from '../services/request';

const Counter = {
  getMoldCounter(id) {
    // mold-counter id or counterId
    return service.get(`/counter/${id}`);
  },
  getMoldCounters(corpId, param) {
    return service.get(`/company/${corpId}/counters`, { params: param });
  },
  saveMoldCounter(data, id) {
    if (id) {
      return service.put(`/counter/${id}`, JSON.stringify(data));
    }
    return service.post(`/counter`, JSON.stringify(data));
  },
  expireMoldCounter(id) {
    return service.put(`/counter/${id}/expire`);
  },
  deleteMoldCounter(id) {
    return service.delete(`/counter/${id}`);
  },
  getCounterPresets(corpId, param) {
    return service.get(`/company/${corpId}/presets`, { params: param });
  },
  getCounterPreset(id) {
    return service.get(`/counter/preset/${id}`);
  },
  saveCounterPreset(data, id) {
    if (id) {
      return service.put(`/counter/preset/${id}`, JSON.stringify(data));
    }
    return service.post(`/counter/preset`, JSON.stringify(data));
  },
  deleteCounterPreset(id) {
    return service.delete(`/counter/preset/${id}`);
  },
  getCdataByCounterAndData(counterId, yyyymmdd) {
    return service.get(`/counter/${counterId}/cdata`, { params: { ymd: yyyymmdd } });
  },
};

export default Counter;
