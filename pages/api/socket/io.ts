import {Server as NetServer} from 'http'
import { NextApiRequest } from 'next'
import {Server as ServerIO} from 'socket.io'
import type { NextApiResponseServerIO } from '@/types'

export const config = {
    api:{
        bodyParse:false
    }
};

const ioHandler = (req:NextApiRequest, res:NextApiResponseServerIO)=>{
    if(!res.socket.server.io){
        const path = '/api/socket/io';
        const httpServer:NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path:path,
            // @ts-ignore
            addTrailingSlash:false
        });
        res.socket.server.io = io;
    }
};
export default ioHandler;