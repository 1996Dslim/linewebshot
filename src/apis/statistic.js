import service from '../services/request';

const Statistic = {
  getHourlyShots(moldId, params) {
    return service.get(`/statistic/daily/mold/${moldId}/shot`, params);
  },
  getHourlyShotsByMonth(moldId, ymd) {
    return service.get(`/statistic/daily/mold/${moldId}/shot/${ymd}`);
  },
  getDailyShotCtByMonth(moldId, yyyymm) {
    return service.get(`/statistic/daily/mold/${moldId}/ct/${yyyymm}`);
  },
  getHourlyShotCtByDate(moldId, ymd) {
    return service.get(`/statistic/hourly/mold/${moldId}/ct/${ymd}`);
  },
  findCounterUseState(companyId) {
    return service.get(`/dashboard/state/counter/${companyId}`);
  },
  findTerminalUseState(companyId) {
    return service.get(`/dashboard/state/terminal/${companyId}`);
  },
  findMoldUseIndicator(companyId) {
    return service.get(`/dashboard/indicator/mold/use/${companyId}`);
  },
  findMoldActiveIndicator(companyId) {
    return service.get(`/dashboard/indicator/mold/active/${companyId}`);
  },
  findMoldOutputIndicator(companyId) {
    return service.get(`/dashboard/indicator/mold/output/${companyId}`);
  },
  findMoldOutputIndicatorByMonth(yyyymm, companyId) {
    return service.get(`/dashboard/indicator/mold/output/${yyyymm}/${companyId}`);
  },
  findMoldOutputIndicatorByMonthAndMold(yyyymm, moldId) {
    return service.get(`/dashboard/indicator/mold/${moldId}/output/${yyyymm}`);
  },
  findCtComplianceIndicator(companyId) {
    return service.get(`/dashboard/indicator/ct/compliance/${companyId}`);
  },
  findDailyActiveIndicatorByMonth(yyyymm, companyId) {
    return service.get(`/dashboard/indicator/active/${yyyymm}/${companyId}`);
  },
  findDailyUsageIndicatorByMonth(yyyymm, companyId) {
    return service.get(`/dashboard/indicator/usage/${yyyymm}/${companyId}`);
  },
  findDailyCtComplianceIndicatorByMonth(yyyymm, companyId) {
    return service.get(`/dashboard/indicator/ct/${yyyymm}/${companyId}`);
  },
  findBatteryState(companyId) {
    return service.get(`/dashboard/battery/${companyId}`);
  },
  findMoldTotalIndicatorByMonth(yyyymm, companyId, params) {
    return service.get(`/indicator/${yyyymm}/${companyId}`, { params: params });
  },
  findMoldUsageIndicatorByMoldAndMonth(yyyymm, moldId) {
    return service.get(`/indicator/usage/${yyyymm}/${moldId}`);
  },
};

export default Statistic;
