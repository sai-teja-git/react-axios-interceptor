import { useEffect, useState } from "react"
import moment from "moment-timezone"
import { useNavigate } from "react-router-dom"
import apiService from "../services/api.service"
import { v4 as uuidv4 } from 'uuid';

export default function Data() {

    const navigate = useNavigate()

    const [lastFetched, setLastFetch] = useState(moment());
    const [rawData, setRawData] = useState<any[]>([]);
    const [fileData, setFileData] = useState<any[]>([]);
    let currentCount = 1

    useEffect(() => {
        getApiData()
        const apiInterval = setInterval(() => {
            getApiData()
        }, 4000)
        return () => {
            clearInterval(apiInterval)
        }
    }, [])

    async function getApiData() {
        await Promise.all([
            apiService.postData({
                id: uuidv4(),
                count: currentCount,
                time: new Date().getTime()
            }).then(() => {
                currentCount++
            }),
            apiService.postRawData({
                id: uuidv4(),
                count: currentCount,
                time: new Date().getTime()
            }).then(() => {
                currentCount++
            })
        ])
        apiService.getFileData().then((res) => {
            console.log('res.data', res.data);
            setLastFetch(moment())
        }).catch((e) => {
            console.log('error', e)
        })
        apiService.getRawData().then((res) => {
            console.log('Raw res.data>>>', res.data);
            setRawData([...res.data?.data ?? []])
        }).catch((e) => {
            console.log('error', e)
        })
        apiService.getStatusData().then((res) => {
            setFileData([...res.data?.data ?? []])
            console.log('Status res.data>>>', res.data);
        }).catch((e) => {
            console.log('error', e)
        })
    }

    return (
        <>
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h3>Last Updated : {lastFetched.format("DD-MM-YYYY HH:mm:ss")}</h3>
                    </div>
                    <div>
                        <button className="btn btn-outline-primary" onClick={() => navigate("/")}>Base Page</button>
                    </div>
                </div>
                <div className="row mt-3" style={{
                    height: "calc(100vh - 135px)",
                    overflow: "auto"
                }}>
                    <div className="col-6">
                        <ol className="list-group list-group-numbered" >
                            {
                                rawData.map(data => (
                                    <li className="list-group-item d-flex justify-content-between align-items-start" key={data.id}>
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{data.id}</div>
                                            {moment(data.time).format("DD-MM-YYYY HH:mm:ss")}
                                        </div>
                                        <span className="badge text-bg-primary rounded-pill">{data.count}</span>
                                    </li>
                                ))
                            }
                        </ol>
                    </div>
                    <div className="col-6">
                        <ol className="list-group list-group-numbered" >
                            {
                                fileData.map(data => (
                                    <li className="list-group-item d-flex justify-content-between align-items-start" key={data.id}>
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{data.id}</div>
                                            {moment(data.time).format("DD-MM-YYYY HH:mm:ss")}
                                        </div>
                                        <span className="badge text-bg-primary rounded-pill">{data.count}</span>
                                    </li>
                                ))
                            }
                        </ol>
                    </div>
                </div>
            </div>
        </>
    )
}
