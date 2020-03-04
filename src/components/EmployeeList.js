import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";

const cols = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text, record) => <Link to={"/detail/" + record.id}>{text}</Link>,
        sorter: {
            compare: (a, b) => {
                return a.name.localeCompare(b.name);
            },
            multiple: 3,
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: {
            compare: (a, b) => {
                return a.email.localeCompare(b.email);
            },
            multiple: 2,
        },
    },
    {
        title: 'Department',
        dataIndex: 'department',
        sorter: {
            compare: (a, b) => a.department.localeCompare(b.department),
            multiple: 1,
        },
    },
    {
        title: 'Last Seen',
        dataIndex: 'last_seen',
    },
]

class EmployeeList extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        return fetch('/data/employees.json')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error(res.status);
            })
            .then(jsonData => {

                jsonData.map(employee => {
                    employee.key = employee.id
                    // Though the array seems to be sorted, just in case!
                    let last_seen = employee.attendances[0].end_time;
                    for (let i = 0; i < employee.attendances.length; i++) {
                        let ls = new Date(last_seen);
                        let temp = new Date(employee.attendances[i].end_time)
                        if (temp > ls) {
                            last_seen = employee.attendances[i].end_time
                        }
                    }
                    employee.last_seen = last_seen
                    return employee
                })

                this.setState({ data: jsonData })
            });
    }

    render() {
        return (
            <div>
                <Table
                    columns={cols}
                    dataSource={this.state.data}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        )
    }
}

export default EmployeeList;
