// Hopefully soon part of @c8y/client library.
/**
 * Allows to use either Cookie-Auth or Basic-Auth
 * of a microservice client request header
 * for Authorization to the Cumulocity API.
 */
class MicroserviceClientRequestAuth {
    /**
     * Authenticates using the credentials which were
     * provided within the request headers of the
     * client call to the microservice.
     * @param headers
     */
    constructor(headers = {}) {
        this.xsrfToken = this.getCookieValue(headers, 'XSRF-TOKEN');
        this.authorizationCookie = this.getCookieValue(headers, 'authorization');
        this.authorizationHeader = headers.authorization;
    }

    updateCredentials(credentials = {}) {
        return undefined;
    }

    getFetchOptions(options) {
        const headers = {
            Authorization: this.authorizationCookie ? `Bearer ${this.authorizationCookie}` : this.authorizationHeader,
            ...(this.xsrfToken ? { 'X-XSRF-TOKEN': this.xsrfToken } : undefined)
        };
        options.headers = Object.assign(headers, options.headers);
        return options;
    }

    getCometdHandshake(config = {}) {
        const KEY = 'com.cumulocity.authn';
        const xsrfToken = this.xsrfToken;
        let token = this.authorizationCookie;
        if (!token && this.authorizationHeader) {
            token = this.authorizationHeader.replace('Basic ', '').replace('Bearer ', '');
        }
        const ext = config.ext = config.ext || {};
        ext[KEY] = Object.assign(ext[KEY] || {}, { token, ...(xsrfToken ? { xsrfToken } : undefined) });
        return config;
    }

    logout() {
        if (this.authorizationCookie) {
            delete this.authorizationCookie;
        }
        if (this.authorizationHeader) {
            delete this.authorizationHeader;
        }
        if (this.xsrfToken) {
            delete this.xsrfToken;
        }
    }

    getCookieValue(headers, name) {
        try {
            const value = headers && headers.cookie && headers.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
            return value ? value.pop() : undefined;
        } catch (ex) {
            return undefined;
        }
    }
}

module.exports = MicroserviceClientRequestAuth;

