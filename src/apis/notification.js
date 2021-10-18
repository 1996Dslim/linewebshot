import service from '../services/request';

const Notification = {
    deleteNotify(id) {
        return service.delete(`/notification/${id}`);
    },
};

export default Notification;
