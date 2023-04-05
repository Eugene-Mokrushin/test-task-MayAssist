import { FormEvent, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { isMobile } from 'react-device-detect';
import { Services } from "@/types"
import classes from '@/styles/apps/SD/NewIssue.module.scss';

type SearchParams = {
    jwt_token?: string;
    backend_baseurl?: string;
    issue_body?: string;
    service_id?: string;
    topic?: string;
}

function NewIssue() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [isError, setIsError] = useState({ errCode: -1, errMsg: '' })
    const [servicesState, setServicesState] = useState<Services[]>([])
    const [selectedOption, setSelectedOption] = useState<number>(-1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false)
    const params: SearchParams = Object.fromEntries([...searchParams])
    const [formData, setFormData] = useState(
        { topic: params.topic ? params.topic : "", issue: params.issue_body ? params.issue_body : "" }
    )
    useEffect(() => {
        const fetchServices = async (fetchAttempt = 0) => {
            try {
                const response = await fetch(import.meta.env.VITE_SD_ISSUE_API_GET);
                if (response.status === 401 || !params.jwt_token) {
                    navigate("/apps/sd")
                } else if (!response.ok) { setIsError({ errCode: response.status, errMsg: response.statusText }) }
                const data = await response.json();
                setServicesState(data.services);
                if (data.services.find((s: Services) => params.service_id && s.id === +params.service_id)) {
                    params.service_id ? setSelectedOption(+params.service_id) : null
                }
            } catch (error) {
                if (fetchAttempt < 3) {
                    fetchServices(fetchAttempt + 1);
                } else {
                    setIsError({ errCode: 500, errMsg: "Серевер не отвечает \n Попрубуйте оставить заявку позже" });
                    console.error("Error fetching services:", error);
                }
            }
        };
        fetchServices()
    }, [])

    const services = servicesState.map(service => {
        return (
            <div
                key={crypto.randomUUID()}
                className={classes.dropdown__option}
                onClick={() => handleOptionClick(service.id)}
            >
                {service.name}
            </div>
        )
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (selectedOption === -1) {
            return
        }
        setIsSubmitted(true)
        let fetchAttempt = 0
        while (fetchAttempt < 3) {
            fetchAttempt++;
            try {
                const bodyData = {
                    topic: formData.topic,
                    description: formData.issue,
                    service_path: servicesState.find(s => s.id === selectedOption)?.path
                }
                const response = await fetch(import.meta.env.VITE_SD_ISSUE_API_POST, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${params.jwt_token}`
                    },
                    body: JSON.stringify(bodyData)
                });
                if (response.ok) {
                    const { id } = await response.json()
                    fetch('')
                    return;
                }
                if (response.status >= 400 && response.status < 500) {
                    setIsError({ errCode: response.status, errMsg: response.statusText })
                    return;
                }
                if (response.status >= 500) {
                    setIsError({
                        errCode: response.status,
                        errMsg: response.statusText ?
                            response.statusText :
                            "Серевер не отвечает \n Попрубуйте оставить заявку позже"
                    })
                    continue;
                }
                continue;
            } catch (error) {
                navigate("/apps/sd")
                continue;
            }
        }
    }

    const handleOptionClick = (option: number) => {
        setSelectedOption(option);
        setDropdownOpen(false);
    };

    const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <div className={`${classes.newIssueWrapper} ${isMobile && classes.mobile}`}>
            {!(isError.errCode !== -1) ? (
                <form onSubmit={(e) => handleSubmit(e)} className={classes.issueForm}>
                    <div className={classes.header}>
                        <div className={classes.header__title}>Создание новой зявки в <strong>MAY360</strong></div>
                        <svg height="1.5rem" fill="rgb(90, 90, 90)" className={classes.header__btn} version="1.1" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                        </svg>
                    </div>
                    <div className={classes.selectionWrapper}>
                        <div className={classes.servicesSelctor}>
                            <div className={`${classes.dropdownHeader} ${isSubmitted && classes.submitted}`} onClick={() => !isSubmitted && setDropdownOpen(!dropdownOpen)}>
                                {selectedOption !== -1 && servicesState.find(s => s.id === selectedOption) ?
                                    `${servicesState.find(s => s.id === selectedOption)?.name}` :
                                    "Выберетете сервис"
                                }
                                <svg style={dropdownOpen ? { transform: "rotate(180deg)" } : {}} width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.95531 6.36418L17.0767 -8.2554e-08L19.111 1.81797L9.95531 10.0001L0.799593 1.81797L2.83388 -6.60549e-07L9.95531 6.36418Z" fill="#101010" />
                                </svg>

                            </div>
                            {dropdownOpen && (
                                <div className={classes.dropdown}>
                                    {services}
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            readOnly={isSubmitted}
                            className={`${classes.topic} ${isSubmitted && classes.submitted}`}
                            placeholder="Тема"
                            required={true}
                            name="topic"
                            value={formData.topic}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="issue"
                            readOnly={isSubmitted}
                            required={true}
                            className={`${classes.issue} ${isSubmitted && classes.submitted}`}
                            placeholder="Описание проблемы"
                            value={formData.issue}
                            onChange={handleInputChange}
                        >
                        </textarea>
                    </div>
                    <button className={classes.submit}>Отправить</button>
                </form>
            ) : (
                <div className={classes.error}>
                    <div className={classes.error__code}>{isError.errCode}</div>
                    <div className={classes.error__message}>{isError.errMsg}</div>
                </div>
            )}
        </div>
    )
}

export default NewIssue