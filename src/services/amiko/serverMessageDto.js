class serverMessageDto {
    constructor(id, content, from, status, createdAt) {
        this.id = id;
        this.content = content;
        this.from = from;
        this.status = status;
        this.createdAt = createdAt;
    }
}

export default ServerMessageDto;