import service from '../services/request';

const Production = {
  findMoldsByCorp(corpId) {
    return service.get(`/production/molds/corp/${corpId}`);
  },
  getShots(moldId, params) {
    return service.get(`/production/mold/${moldId}/shot`, params);
  },
  saveShots(data) {
    return service.put(`/production/shots/hourly`, JSON.stringify(data));
  },
};

export default Production;
