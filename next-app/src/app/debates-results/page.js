"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Label } from "@components/ui/label";
import { ScrollArea } from "@components/ui/scroll-area";
import DebateBig from "../components/Debate/DebateBig/DebateBig";
import PhraseFilter from "../components/Filters/PhraseFilter/PhraseFilter";

export default function DebateSearch() {
    const [date, setDate] = useState(null);
    const [debates, setDebates] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [topics, setTopics] = useState([]);
    const [inputValues, setInputValues] = useState({
        startDate: "",
        endDate: "",
        parliament_session: "",
        keyPhrase: "",
        session: "",
        meeting: "",
        period: "",
        topics: [],
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
                const response = await fetch("http://localhost:3000/api/strapi/debates/all");
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
                const response = await fetch("http://localhost:3000/api/strapi/parliamentSession/uniqueAttributes");
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
                const response = await fetch("http://localhost:3000/api/strapi/topics/all");
                const data = await response.json();

                console.log("DATA: ", data);

                setTopics(data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, []);

    const handleInputChange = (name, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    console.log("Input Values: ", inputValues);

    return (
      <div className="flex text-[white] text-[.85rem]">
          {/* Search Filters Sidebar */}
          <Card className="p-4 h-fit bg-[#1E1F23] w-[30%]">
              <div className="space-y-6">
                  {/* Date Picker */}
                  <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover className="border-4">
                          <PopoverTrigger>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4"/>
                                  {date ? date.toLocaleDateString() : "Select date"}
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus/>
                          </PopoverContent>
                      </Popover>
                  </div>

                  {/* Key Phrase Search */}
                  <div className="space-y-2 w-[100%]">
                      <Label>Key Phrase</Label>
                      <PhraseFilter />
                  </div>

                  {/* Parliament Session Dropdowns */}
                  <div className="mb-6">
                      {/* Session Input */}
                      <div className="flex flex-col space-y-2 mb-6">
                          <Label htmlFor="session">Session:</Label>
                          <select id="session" value={inputValues.session}
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
                          <Label htmlFor="period">Period:</Label>
                          <select id="period" value={inputValues.period}
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
                          <Label htmlFor="meeting">Meeting:</Label>
                          <select id="meeting" value={inputValues.meeting}
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

                  {/* Search Button */}
                  <div className="flex justify-center">
                      <button className="w-1/2 bg-black text-[white] rounded-2xl p-2">Search Debates</button>
                  </div>
              </div>
          </Card>

          {/* Results Area */}
          <Card className="p-4 w-[70%]">
              <div className="flex justify-between items-center mb-6 text-[black] border-4">
                  <h2 className="text-xl font-semibold text-[black]">Search Results</h2>
                  <Select defaultValue="newest" className="text-[black]">
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by"/>
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="relevance">Relevance</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              {/* Debates List */}
              <div className="space-y-4 border-4">
                  <div className="flex flex-col items-start p-8">
                      {debates.map((debate, index) => (
                        <DebateBig
                          style={{width: "70%"}}
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
          </Card>
      </div>
    );
}
