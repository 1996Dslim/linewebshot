import service from '../services/request';

const SingularityApi = {
  findByCorp(corpId, yyyymm){
    return service.get(`/singularity/company/${corpId}/${yyyymm}`);
  },
  findByMold(moldId, yyyymm){
    return service.get(`/singularity/mold/${moldId}/${yyyymm}`);
  },
  findListByMold(moldId, ymd, target){
    return service.get(`/singularity/mold/${moldId}/${ymd}/${target}`);
  },
};

export default SingularityApi;
