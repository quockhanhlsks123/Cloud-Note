import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import "./styles.css";
import "./search.scss";

import Cookies from 'js-cookie';
import unorm from "unorm";
import { ConstructionOutlined } from "@mui/icons-material";

function SearchInput({ onSearchItemClick }) {
    const handleItemClick = (idNote) => {
        onSearchItemClick(idNote);
    };

    const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInitialSearch, setIsInitialSearch] = useState(true);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleClickHistory = (historyText) => {
        handleDeleteSearchHistory(historyText);
        setSearchQuery(historyText);
    }

    // Lấy lịch sử tìm kiếm từ cookie khi component được tạo
    useEffect(() => {
        const savedHistory = Cookies.get('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    const normalizeString = (str) => {
        const normalizedStr = unorm.nfkd(str).replace(/[\u0300-\u036F]/g, '').toLowerCase();
        return encodeURIComponent(normalizedStr);
    };
    const handleNoteForm = (note) => {
        // Xử lý cập nhật ghi chú tại đây (có thể gọi API hoặc lưu vào state,...)
        console.log("Updating note:", note);
    };

    useEffect(() => {

        if (shouldTriggerSearch) {
            handleSearch();
            setShouldTriggerSearch(false);
        }
    }, [shouldTriggerSearch]);

    const handleSearch = async () => {
        try {
            if (searchQuery.trim() === '') {
                setErrorMessage('Bạn phải điền từ khóa ');
                return;
            }
            setErrorMessage('');
            setIsInitialSearch(false);
            const normalizedQuery = normalizeString(searchQuery);
            const response = await userApi.search(normalizedQuery);

            setSearchResults(Object.values(response.search_note.reduce((init, curr) => {
                //convert
                //from {idNote: {content: ["str", ...], type: "str", title: ""}, ...} 
                //to   [idNote: {content: ["str", ...], type: "str", title: ""}, ...]
                if(init[curr.idNote]) {
                    init[curr.idNote].content.push(curr.content);
                }
                else init[curr.idNote] = {
                    type: curr.type,
                    idNote: curr.idNote,
                    title: curr.title,
                    content: [curr.content]
                }

                return init;

            }, {})) );

            if (!searchHistory.includes(searchQuery)) {
                const updatedHistory = [searchQuery, ...searchHistory];
                setSearchHistory(updatedHistory);
                // Lưu lịch sử tìm kiếm vào cookie
                const save = Cookies.set('searchHistory', JSON.stringify(updatedHistory));
            }
        } catch (error) {
            console.error('Lỗi khi tải kết quả tìm kiếm:', error);
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (searchQuery.trim() !== '') {
                handleSearch();
            } else {
                setErrorMessage('Bạn phải điền từ khóa ');
            }
        }
    };
    const highlightText = (text, searchQuery) => {
        if(searchQuery.trim().length !== 0) {
            const regex = new RegExp(`(${searchQuery})`, 'gi');
            const parts = text.split(regex);
            return parts.map((part, index) => (
                regex.test(part) ? (
                    <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
                ) : (
                    <React.Fragment key={index}>{part}</React.Fragment>
                )
            ));            
        }
        else {
            return <React.Fragment>{text}</React.Fragment>
        }

    };
    const rearrangeSearchResults = (results) => {
        const sortedResults = results.sort((a, b) => {
            const aIndex = a.title.toLowerCase().indexOf(searchQuery.toLowerCase());
            const bIndex = b.title.toLowerCase().indexOf(searchQuery.toLowerCase());
            return aIndex - bIndex;
        });

        return sortedResults;
    };
    const displayResults = rearrangeSearchResults(searchResults).map((result, index) => (
        <div key={index} className="custom-item" onClick={() => handleItemClick(result.idNote)}>
            <p>{index + 1}</p>
            <div>
                <p className="title">{highlightText(result.title, searchQuery)}</p>
            </div>

            <div>
                {result.content.map(e => (
                    <p className='content'>{highlightText(e, searchQuery)}</p>
                ))}
            </div>


        </div>
    ));
    const handleDeleteSearchHistory = (historyItem) => {
        const updatedHistory = searchHistory.filter(item => item !== historyItem);
        setSearchHistory(updatedHistory =>  searchHistory.filter(item => item !== historyItem));
        // Lưu lại lịch sử tìm kiếm mới vào cookie
        Cookies.set('searchHistory', JSON.stringify(updatedHistory));
        setShowSearchHistory(updatedHistory.length > 0);
    };
    return (

        <div className='wrap'>
            <div className='search'>
                <div className="search-box">
                    <input
                        type='text'
                        className='searchTerm'
                        placeholder="Type content or title to find?"
                        value={searchQuery}
                        onChange={e => {
                            setShowSearchHistory(e.target.value.trim().length !== 0 || isInputFocused);        
                            setSearchQuery(e.target.value);  

                            // tu dong an ket qua khi co input moi
                            setSearchResults([]);    
                            //

                        }}
                        onKeyPress={handleKeyPress}
                        onFocus={() => {
                            setIsInputFocused(true);
                            // setShowSearchHistory(searchQuery === '' || isInputFocused);
                            setShowSearchHistory(true);
                        }}
                        onBlur={() => {
                            setIsInputFocused(false);
                            // setShowSearchHistory(false);
                            setTimeout(() => {
                                setShowSearchHistory(false);
                            }, 200);
                        }}
                    />
                    {showSearchHistory && searchHistory.length > 0 && (
                        <div className="search-history">
                            {searchHistory.map((historyItem, index) => (
                                <div className="del"
                                onClick={(e) => {
                                    if(e.target === e.currentTarget) {
                                        handleClickHistory(historyItem);
                                    }
                                }}
                                >
                                    <span key={index} onClick={() => setSearchQuery(historyItem)}>
                                        {historyItem}
                                    </span>
                                    <button className="delete-history-button"
                                        onClick={() => handleDeleteSearchHistory(historyItem)}>X</button>
                                </div>


                            ))}

                        </div>
                    )}
                </div>

                <button type='submit' className='searchButton' onClick={handleSearch}>
                    <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M10.4058 0.0297308C4.66774 0.0297308 0 4.69747 0 10.4355C0 16.1736 4.66774 20.8413 10.4058 20.8413C12.1599 20.8413 13.8843 20.4251 15.3411 19.6224C15.4578 19.7628 15.5872 19.8922 15.7276 20.0089L18.7007 22.9819C18.9752 23.2908 19.31 23.5404 19.6844 23.7152C20.0589 23.8901 20.4651 23.9865 20.8782 23.9987C21.2913 24.0109 21.7025 23.9385 22.0866 23.7859C22.4707 23.6334 22.8196 23.404 23.1118 23.1118C23.404 22.8196 23.6334 22.4707 23.7859 22.0866C23.9384 21.7025 24.0108 21.2913 23.9987 20.8782C23.9865 20.4651 23.8901 20.0589 23.7152 19.6844C23.5404 19.31 23.2908 18.9752 22.9819 18.7007L20.0089 15.7276C19.864 15.5827 19.7046 15.4532 19.5332 15.3411C20.3359 13.8843 20.8413 12.1896 20.8413 10.4058C20.8413 4.66774 16.1736 0 10.4355 0L10.4058 0.0297308ZM10.4058 3.00282C14.5384 3.00282 17.8385 6.30294 17.8385 10.4355C17.8385 12.3978 17.125 14.2113 15.8763 15.5492C15.8465 15.579 15.8168 15.6087 15.7871 15.6384C15.6466 15.7551 15.5173 15.8845 15.4006 16.0249C14.0924 17.2142 12.3086 17.898 10.3761 17.898C6.24348 17.898 2.94335 14.5978 2.94335 10.4653C2.94335 6.33267 6.24348 3.03255 10.3761 3.03255L10.4058 3.00282Z'
                            fill='black'
                        />
                    </svg>
                </button>

                <div className="search_Results">

                    {errorMessage ? <p>{errorMessage}</p> : (isInitialSearch ? null : displayResults.length > 0 ? displayResults : <p>Xin lỗi: không tìm thấy kết quả!</p>)}
                </div>

            </div>


        </div>



    );
}

export default SearchInput;