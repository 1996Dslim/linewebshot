import service from '../services/request';

const Terminal = {
  getTerminals(corpId, param) {
    return service.get(`/company/${corpId}/terminals`, { params: param });
  },
  getTerminal(id) {
    return service.get(`/terminal/${id}`);
  },
  saveTerminal(data, id) {
    if (id) {
      return service.put(`/terminal/${id}`, JSON.stringify(data));
    }
    return service.post(`/terminal`, JSON.stringify(data));
  },
  expireTerminal(id) {
    return service.put(`/terminal/${id}/expire`);
  },
  deleteTerminal(id) {
    return service.delete(`/terminal/${id}`);
  },
  getLastTdata(terminalId) {
    return service.get(`/terminal/${terminalId}/tdata/last`);
  },
};

export default Terminal;
