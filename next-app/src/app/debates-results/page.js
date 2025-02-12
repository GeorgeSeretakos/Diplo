"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@components/ui/label";
import DebateBig from "../components/Debate/DebateBig/DebateBig";
import SearchSection from "@components/ui/SearchSection";
import Select from "react-select";


export default function DebateSearch() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [debates, setDebates] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [topics, setTopics] = useState([]);
    const [speakers, setSpeakers] = useState([]);
    const [inputValues, setInputValues] = useState({
        startDate: "",
        endDate: "",
        keyPhrase: "",
        session: "",
        meeting: "",
        period: "",
        topics: [],
        speakers: [],
    });

    const toggleTopic = (topic) => {
        setInputValues(prev => ({
            ...prev,
            topics: prev.topics.includes(topic)
              ? prev.topics.filter(t => t !== topic)  // Remove if already selected
              : [...prev.topics, topic]              // Add if not selected
        }));
    };

    useEffect(() => {
        const fetchAllDebates = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/strapi/debates/all`);
                const data = await response.json();
                setDebates(data);
            } catch (error) {
                console.error("Error fetching all debates:", error);
            }
        };
        fetchAllDebates();
    }, []);

    useEffect(() => {
        const fetchParliamentSessionAttributes = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/strapi/parliamentSession/uniqueAttributes`);
                const data = await response.json();

                setSessions(data.sessions || []);
                setPeriods(data.periods || []);
                setMeetings(data.meetings || []);
            } catch (error) {
                console.error("Error fetching unique attributes:", error);
            }
        };
        fetchParliamentSessionAttributes();
    }, []);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/strapi/topics/all`);
                const data = await response.json();

                console.log("DATA: ", data);

                setTopics(data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/strapi/speakers/all`);
                const data = await response.json();

                const speakerNames = data.map((speaker) => speaker.speaker_name);

                console.log("Processed Speaker Names: ", speakerNames);
                setSpeakers(speakerNames);

                console.log("DATA: ", data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchSpeakers();
    }, []);

    const handleInputChange = (name, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    console.log("Input Values: ", inputValues);

    return (
      <div className="bg-black">
          <div className="flex items-center pt-8 pb-4 bg-black border-b-2 w-[80%] m-auto">
              <div className="text-white flex justify-center text-4xl w-[30%] font-bold"><div>Search Debates</div></div>
              <div className="w-[70%] pr-8 pl-8 flex justify-center">
                  <SearchSection/>
              </div>
          </div>


          <div className="flex text-white w-[80%] m-auto">
          {/* Search Filters Sidebar */}
              <div className={`space-y-6 p-10 h-fit bg-black w-[30%] min-h-[100vh] ${isDropdownOpen ? 'h-auto' : ''}`}>

                  <div className="mb-6">

                      {/* Start Date */}
                      <div className="flex flex-col space-y-2 mb-6">
                          <Label htmlFor="startDate">Start Date</Label>
                          <input
                            type="date"
                            className="w-full bg-gray text-white p-2 rounded-md outline-none"
                            value={inputValues.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                          />
                      </div>

                      {/* End Date */}
                      <div className="flex flex-col space-y-2 mb-6">
                          <Label htmlFor="endDate">End Date</Label>
                          <input
                            type="date"
                            className="w-full bg-gray text-white p-2 rounded-md outline-none"
                            value={inputValues.endDate}
                            onChange={(e) => handleInputChange("endDate", e.target.value)}
                          />
                      </div>

                      {/* Session Input */}
                      <div className="flex flex-col space-y-2 mb-6">
                          <Label htmlFor="session">Session</Label>
                          <select id="session" className="text-xs" value={inputValues.session}
                                  onChange={(e) => handleInputChange("session", e.target.value)}>
                              <option value="">-- Select Session --</option>
                              {sessions.map((session, index) => (
                                <option key={index} value={session}>
                                    {session}
                                </option>
                              ))}
                          </select>
                      </div>

                      {/* Period Input */}
                      <div className="flex flex-col space-y-2 mb-6">
                          <Label htmlFor="period">Period</Label>
                          <select id="period" className="text-xs" value={inputValues.period}
                                  onChange={(e) => handleInputChange("period", e.target.value)}>
                              <option value="">-- Select Period --</option>
                              {periods.map((period, index) => (
                                <option key={index} value={period}>
                                    {period}
                                </option>
                              ))}
                          </select>
                      </div>

                      {/* Meeting Input */}
                      <div className="flex flex-col space-y-2  mb-6">
                          <Label htmlFor="meeting">Meeting</Label>
                          <select id="meeting" className="text-xs" value={inputValues.meeting}
                                  onChange={(e) => handleInputChange("meeting", e.target.value)}>
                              <option value="">-- Select Meeting --</option>
                              {meetings.map((meeting, index) => (
                                <option key={index} value={meeting}>
                                    {meeting}
                                </option>
                              ))}
                          </select>
                      </div>
                  </div>

                  {/* Participating Speakers Searchable Multi-Select */}
                  <div className="flex flex-col space-y-2 mb-6">
                      <Label htmlFor="speakers">Participating Speakers:</Label>
                      <Select
                        isMulti
                        options={speakers.map((speaker) => ({ value: speaker, label: speaker }))} // ✅ Only using speaker_name
                        value={inputValues.speakers.map((s) => ({ value: s, label: s }))} // ✅ Properly formatted
                        onChange={(selectedOptions) =>
                          handleInputChange("speakers", selectedOptions ? selectedOptions.map((option) => option.value) : [])
                        }
                        onMenuOpen={() => setIsDropdownOpen(true)}
                        onMenuClose={() => setIsDropdownOpen(false)}
                        placeholder="Search and select speakers..."
                        className="text-xs"
                        styles={{
                            control: (base, { isFocused }) => ({
                                ...base,
                                backgroundColor: "#2B2D31", // bg-gray-800
                                color: "white",
                                borderRadius: "6px",
                                border: "none",
                                boxShadow: isFocused ? "none" : "none", // ✅ Removes blue focus ring
                            }),
                            input: (base) => ({
                                ...base,
                                color: "white", // ✅ Ensures input text is white
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#2B2D31", // bg-gray-800
                                color: "white",
                                position: "absolute",
                                zIndex: 9999,
                            }),
                            option: (base, { isFocused }) => ({
                                ...base,
                                backgroundColor: isFocused ? "#374151" : "#2B2D31", // bg-gray-700 on hover, bg-gray-800 otherwise
                                color: "white",
                                fontSize: "0.75rem",
                                lineHeight: "1rem"
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "white", // ✅ Ensures selected value text is white
                            }),
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#374151", // bg-gray-700
                                color: "white",
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: "white",
                            }),
                            multiValueRemove: (base) => ({
                                ...base,
                                color: "white",
                                ":hover": {
                                    backgroundColor: "#4b5563", // bg-gray-600 on hover
                                },
                            }),
                        }}
                        menuPosition="absolute"
                        menuPortalTarget={document.body}
                      />




                  </div>

                  {/* Topics */}
                  <div className="text-white space-y-2">
                      <Label>Topics</Label>
                      <div className="flex flex-wrap gap-3 rounded-lg">
                          {topics.map((topic, index) => (
                            <button
                              key={index}
                              onClick={() => toggleTopic(topic.topic)}
                              className={`p-2 text-[15px] border border-gray-500 rounded-lg transition ${
                                inputValues.topics.includes(topic.topic)
                                  ? "bg-gray-700 text-white"
                                  : "bg-transparent text-gray-300 hover:bg-gray-800"
                              }`}
                            >
                                {topic.topic}
                            </button>
                          ))}
                      </div>
                  </div>

              </div>

              {/* Debates List */}
              <div className="w-[70%] flex flex-col items-center p-8 space-y-10 ">
                  {debates.map((debate, index) => (
                    <DebateBig
                      style={{width: "100%"}}
                      key={index}
                      documentId={debate.documentId}
                      title={debate.title}
                      date={debate.date}
                      topics={debate.topics}
                      session={debate.session}
                      period={debate.period}
                      meeting={debate.meeting}
                    />
                  ))}
              </div>
          </div>

      </div>
    );
}
