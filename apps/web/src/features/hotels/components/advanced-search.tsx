"use client";
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/components/popover";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/lib/utils";

interface SearchData {
  destination: string;
  dateRange: DateRange | undefined;
  rooms: number;
  adults: number;
  children: number;
  priceRange: string;
  starRating: string;
}

interface HotelSearchProps {
  className?: string;
}

const HotelSearchComponent: React.FC<HotelSearchProps> = ({ className }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    dateRange: undefined,
    rooms: 1,
    adults: 2,
    children: 0,
    priceRange: "",
    starRating: ""
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleSearch = () => {
    console.log("Search data:", searchData);
    // Here you would typically call your search API
  };

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return "Select dates";
    if (!dateRange.to) {
      return dateRange.from.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    }
    return `${dateRange.from.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })} - ${dateRange.to.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })}`;
  };

  const incrementGuests = (type: "rooms" | "adults" | "children") => {
    setSearchData((prev) => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const decrementGuests = (type: "rooms" | "adults" | "children") => {
    setSearchData((prev) => ({
      ...prev,
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] - 1)
    }));
  };

  return (
    <Card className={cn("w-full max-w-6xl mx-auto shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Destination */}
          <div className="lg:col-span-4">
            <Label
              htmlFor="destination"
              className="text-sm font-medium mb-2 block"
            >
              Destination
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="destination"
                placeholder="Where are you going?"
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    destination: e.target.value
                  }))
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="lg:col-span-4">
            <Label className="text-sm font-medium mb-2 block">
              Check-in / Check-out
            </Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setIsDatePickerOpen(true)}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {formatDateRange(searchData.dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={searchData.dateRange?.from}
                  selected={searchData.dateRange}
                  // onSelect={(dateRange) => {
                  //   setSearchData((prev) => ({ ...prev, dateRange }));
                  //   if (dateRange?.from && dateRange?.to) {
                  //     setIsDatePickerOpen(false);
                  //   }
                  // }}
                  numberOfMonths={2}
                  // disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests & Rooms */}
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium mb-2 block">
              Guests & Rooms
            </Label>
            <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {searchData.adults + searchData.children} guests,{" "}
                  {searchData.rooms} room{searchData.rooms > 1 ? "s" : ""}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  {/* Rooms */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Rooms</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrementGuests("rooms")}
                        disabled={searchData.rooms <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {searchData.rooms}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => incrementGuests("rooms")}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-gray-500">
                        Ages 13 or above
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrementGuests("adults")}
                        disabled={searchData.adults <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {searchData.adults}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => incrementGuests("adults")}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-gray-500">Ages 0-12</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrementGuests("children")}
                        disabled={searchData.children <= 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {searchData.children}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => incrementGuests("children")}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2 ">
            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              size="lg"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Mobile Layout Adjustments */}
        <div className="lg:hidden mt-4">
          <Button
            onClick={handleSearch}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="lg"
          >
            <Search className="mr-2 h-4 w-4" />
            Search Hotels
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelSearchComponent;
