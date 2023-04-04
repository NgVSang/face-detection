const response = (data: Object, message: string, status: number) => {
    return { status: status, data: data, message: message };
};

export default response;
