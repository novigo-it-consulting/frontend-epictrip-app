class serverMessageDto {
    constructor(id, content, from, status, createdAt, fromLang, toLang) {
        this.id = id;
        this.content = content;
        this.from = from;
        this.status = status;
        this.createdAt = createdAt;
        this.fromLang = fromLang;
        this.toLang = toLang
    }
}

export default ServerMessageDto;