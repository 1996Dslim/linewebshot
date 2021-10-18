import service from '../services/request';

const Company = {
  getCompanies() {
    return service.get(`/company`);
  },
  getCompany(corpId) {
    return service.get(`/company/${corpId}`);
  },
  getPartners(corpId, conditions) {
    return service.get(`/company/${corpId}/partner`, { params: conditions });
  },
  getMembersByCompany(corpId) {
    return service.get(`/company/${corpId}/member`);
  },
  getMember(corpId, id) {
    return service.get(`/company/${corpId}/member/${id}`);
  },
  checkBrn(brn) {
    return service.post(`/company/check/brn`, brn);
  },
  downloadFile(id) {
    return service.get(`/company/${id}/download/cbr`, {
      responseType: 'blob',
    });
  },
  approvalCompany(entity, id) {
    return service.put(`/company/approval/${id}`, JSON.stringify(entity));
  },
  saveCompany(entity, id) {
    const headers = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    if (id && id !== 0) {
      entity.id = id;
      return service.put(`/company/${id}`, entity, headers);
    }
    if (entity.id) delete entity.id;
    return service.post('/company/register', entity, headers);
  },
  deleteCompany(id) {
    return service.delete(`/company/${id}`);
  },
};

export default Company;
