import React, { useState } from "react";
import list from "./utils/mockdata";
import DatePicker from "react-datepicker";
import * as XLSX from "xlsx";
import "react-datepicker/dist/react-datepicker.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Todo = () => {
    const [data, setData] = useState(list);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const editTask = (index) => {
        const newDescription = prompt("Enter new description:", data[index].info.Description);
        if (newDescription) {
            const newData = [...data];
            newData[index].info.Description = newDescription; 
            setData(newData);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(currentRows.map(item => item.info)); 
        const workbook = XLSX.utils.book_new(); 
        XLSX.utils.book_append_sheet(workbook, worksheet, "Todo Data"); 
        XLSX.writeFile(workbook, "TodoData.xlsx"); 
    };

    const deleteTask = (index) => {
        const newData = data.filter((_, i) => i !== index); 
        setData(newData); 
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = selectedDate
        ? data.filter((item) => 
            new Date(item.info.Date).toDateString() === selectedDate.toDateString() &&
            (item.info.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.info.Statstics.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.info.Date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.info.Time.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : data.filter((item) => 
            item.info.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.info.Statstics.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.info.Date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.info.Time.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); 
    };

    return (
        <div className="main-container">
            <div className="nav-bar">
                <ul>
                    <li><i className="fas fa-tachometer-alt"></i>Dashboard</li>
                    <li><i className="fas fa-hand-holding-usd"></i>Investors </li>
                    <li><i className="fas fa-info-circle"></i>About Us </li>
                    <li><i className="fas fa-newspaper"></i>News </li>
                    <li><i className="fas fa-map-marker-alt"></i>Address </li>
                    <li><i className="fas fa-sign-out-alt"></i>Logout</li>     
                </ul>
            </div>
            <div className="container">
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Search Here"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                  
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select a date"
                    />
                    <button onClick={exportToExcel} className="excel"><i className="fas fa-download"></i></button>
                </div>
                <div className="list">
                    <table>
                        <thead>
                            <tr>
                                <th className="col1">Description</th>
                                <th className="col2">Statistics</th>
                                <th className="col2">Date</th>
                                <th className="col2">Time</th>
                                <th className="col2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.info.Description}</td>
                                    <td>{item.info.Statstics}</td>
                                    <td>{item.info.Date}</td>
                                    <td>{item.info.Time}</td>
                                    <td>
                                        <div className="icons">
                                            <i
                                                className="fas fa-edit"
                                                onClick={() => editTask(i + indexOfFirstRow)}
                                            ></i>
                                            <i
                                                className="fas fa-trash-alt"
                                                onClick={() => deleteTask(i + indexOfFirstRow)}
                                            ></i>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <select onChange={handleRowsPerPageChange} value={rowsPerPage}>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handleClick(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Todo;
