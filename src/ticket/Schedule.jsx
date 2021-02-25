import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URI from 'urijs';
import dayjs from 'dayjs';
import classnames from 'classnames';
import leftPad from 'left-pad';
import './Schedule.css';

const ScheduleRow = memo(function ScheduleRow(props) {
    const {
        index,
        station,
        arriveTime,
        departTime,
        stay,

        isStartStation,
        isEndStation,
        isDepartStation,
        isArriveStation,
        beforeDepartStation,
        afterArriveStation,
    } = props;
    return (
        <li>
            <div
                className={classnames('icon', {
                    'icon-red': isDepartStation || isArriveStation,
                })}
            >
                {isDepartStation
                    ? 'Dpt'
                    : isArriveStation
                    ? 'Arv'
                    : leftPad(index, 2, 0)}
            </div>
            <div
                className={classnames('row', {
                    grey: beforeDepartStation || afterArriveStation,
                })}
            >
                <span
                    className={classnames('station', {
                        red: isArriveStation || isDepartStation,
                    })}
                >
                    {station}
                </span>
                <span
                    className={classnames('arrtime', {
                        red: isArriveStation,
                    })}
                >
                    {isStartStation ? 'Dpt Stn' : arriveTime}
                </span>
                <span
                    className={classnames('deptime', {
                        red: isDepartStation,
                    })}
                >
                    {isEndStation ? 'Arv Stn' : departTime}
                </span>
                <span className="stoptime">
                    {isStartStation || isEndStation ? '-' : stay + ' Min'}
                </span>
            </div>
        </li>
    );
});

ScheduleRow.propTypes = {};

const Schedule = memo(function Schedule(props) {
	 const { date, trainNumber, departStation, arriveStation } = props;

	 const [scheduleList, setScheduleList] = useState([]);
	 
	 useEffect(() => {
        const url = new URI('/rest/schedule')
            .setSearch('trainNumber', trainNumber)
            .setSearch('departStation', departStation)
            .setSearch('arriveStation', arriveStation)
            .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
            .toString();
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let departRow;
                let arriveRow;

                for (let i = 0; i < data.length; ++i) {
                    if (!departRow) {
                        if (data[i].station === departStation) {
                            departRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: true,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        } else {
                            Object.assign(data[i], {
                                beforeDepartStation: true,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        }
                    } else if (!arriveRow) {
                        if (data[i].station === arriveStation) {
                            arriveRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: true,
                            });
                        } else {
                            Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        }
                    } else {
                        Object.assign(data[i], {
                            beforeDepartStation: false,
                            isDepartStation: false,
                            afterArriveStation: true,
                            isArriveStation: false,
                        });
                    }

                    Object.assign(data[i], {
                        isStartStation: i === 0,
                        isEndStation: i === data.length - 1,
                    });
                }

                setScheduleList(data);
            });
    }, [date, trainNumber, departStation, arriveStation]);

  return (
    <div className="schedule">
        <div className="dialog">
                <h1>Train Schedule</h1>
                <div className="head">
                    <span className="station">Station</span>
                    <span className="deptime">Arrive</span>
                    <span className="arrtime">Depart</span>
                    <span className="stoptime">Stop Time</span>
                </div>
                <ul>
                    {scheduleList.map((schedule, index) => {
                        return (
                            <ScheduleRow
                                key={schedule.station}
                                index={index + 1}
                                {...schedule}
                            />
                        );
                    })}
                </ul>
            </div>
    </div>
	);
});

Schedule.propTypes = {
    date: PropTypes.number.isRequired,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired,
};

export default Schedule;