export class Repository {
    private webApi: ComponentFramework.WebApi;

    constructor(webApi: ComponentFramework.WebApi) {
        this.webApi = webApi;
    }

    public async getLatestValue(entityType?: string, entityId?: string, fieldName?: string) {
        if (!entityType || !entityId || !fieldName) {
            console.error("Invalid parameters for retrieving the latest value.");
            return "";
        }
        const response = await this.webApi.retrieveRecord(entityType, entityId, `?$select=${fieldName}`);
        return response ? response[fieldName] : "";
    }
}