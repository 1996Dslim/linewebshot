import service from '../services/request';

const CustomCode = {
  getCode(companyId, code) {
    return service.get(`/company/${companyId}/customcd/${code}`);
  },
  getCodes(companyId) {
    return service.get(`/customcd/${companyId}`);
  },
  getSICodes(lvl, cd) {
    return service.get(`/commcd/sic/${lvl}`, { params: { cd: cd } });
  },
  saveCode(data, companyId, id) {
    if (id) {
      return service.put(`/customcd/${companyId}/${id}`, JSON.stringify(data));
    }
    return service.post(`/customcd/${companyId}`, JSON.stringify(data));
  },
  deleteCode(companyId, id) {
    return service.delete(`/customcd/${companyId}/${id}`);
  },
};

export default CustomCode;
