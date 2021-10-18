import service from '../services/request';

const Auth = {
    signin(data) {
        return service.post('/auth/signin', JSON.stringify(data));
    },
    
    signout() {
        console.log('LOGOUT~');
    },

    refresh(data) {
        return service.post('/auth/refresh', JSON.stringify(data));
    },

    remoteSignIn(id, remoteId) {
        return service.post("/user/".concat(id, "/remote"), remoteId);
    },

    signup(entity) {
        const headerOpts = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        if (entity.id) delete entity.id;
        return service.post('/auth/signup', entity, headerOpts);
    },

    signupUser(data) {
        return service.post('/auth/signup/user', JSON.stringify(data));
    },

    checkUserId(userId) {
        return service.post("/auth/check/user", userId);
    },

    checkCorp(corpName) {
        return service.post("/auth/check/corp", corpName);
    }
};

export default Auth;