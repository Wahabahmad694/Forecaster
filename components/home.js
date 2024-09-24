import { useState, useCallback, useEffect } from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";

import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { tailwind } from "react-native-tailwindcss";
import { debounce } from "lodash"
import { fetchLocation, fetchWeatherForecast } from "../api/weather";

import { CalendarDaysIcon } from "react-native-heroicons/solid";

import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage";



const Home = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);


    const handleLocation = (loc) => {
        // console.warn("location: ", loc)
        setLocations([]);
        setShowSearch(false);
        setLoading(true);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7',
        }).then(data => {
            setWeather(data);
            setLoading(false);
            storeData("city", loc.name);
            // console.log("forcast data: ", data)
        })
    }

    const handleSearch = value => {
        //fetch location api
        if (value.length > 2) {
            fetchLocation({ cityName: value }).then(data => {
                setLocations(data);
            })
        }
    }

    useEffect(() => {
        fetchMyWeatherData();
    }, []);


    const fetchMyWeatherData = async () => {
        let myCity = await getData('city');
        let cityName = 'Islamabad';
        if (cityName) cityName = myCity;
        fetchWeatherForecast({
            cityName,
            days: '7',
        }).then(data => {
            setWeather(data);
            setLoading(false);
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
    const { current, location } = weather;

    return (
        <View className="flex-1 relative">
            <StatusBar barStyle={'light-content'} />
            <Image source={require('../assets/bg.png')} blurRadius={70} className="absolute h-full w-full" />

            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
                    </View>
                ) : (
                    <SafeAreaView className="flex flex-1">
                        {/* Search function */}
                        <View style={[styles.searchBarContainer, { backgroundColor: showSearch ? '#575759' : 'rgba(0,0,0,0)' }]} >
                            <View className="flex-row justify-end items-center round-full " >
                                {
                                    showSearch ?
                                        <TextInput
                                            onChangeText={handleTextDebounce}
                                            placeholder="Search City"
                                            placeholderTextColor={'white'}
                                            className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                                        />
                                        : null
                                }
                                <TouchableOpacity
                                    style={styles.searchIcon} onPress={() => setShowSearch(!showSearch)}>
                                    <MagnifyingGlassIcon size={25} color="white" />
                                </TouchableOpacity>
                            </View>
                            {
                                locations.length > 0 && showSearch ?
                                    (
                                        <View style={
                                            [tailwind.absolute, tailwind.wFull, tailwind.bgGray200, styles.suggestionList]}>
                                            {
                                                locations.map((loc, index) => {
                                                    let showBorder = index + 1 != locations.length;
                                                    let borderClass = showBorder ? [tailwind.borderB2, tailwind.borderGray400] : '';
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => handleLocation(loc)}
                                                            key={index}
                                                            style={[
                                                                tailwind.flexRow,
                                                                tailwind.itemsCenter,
                                                                tailwind.border0,
                                                                tailwind.p3,
                                                                tailwind.pX4,
                                                                tailwind.mB1,
                                                                borderClass


                                                            ]}
                                                        >
                                                            <MapPinIcon size={20} color="grey" />
                                                            <Text style={styles.listText}>{loc?.name}, {loc?.country}</Text>
                                                        </TouchableOpacity>

                                                    )
                                                })


                                            }
                                        </View>

                                    ) : null
                            }


                        </View>

                        {/* Forcasting View */}
                        <View style={
                            [
                                tailwind.mX4,
                                tailwind.flex,
                                tailwind.justifyAround,
                                tailwind.flex1,
                                tailwind.mB2
                            ]}>
                            {/* location */}
                            <Text style={[tailwind.text2xl, tailwind.textCenter, tailwind.fontBold, tailwind.textWhite]}>
                                {location?.name},
                                <Text style={[tailwind.textLg, tailwind.fontSemibold, tailwind.textGray300]}>
                                    {"" + location?.country}
                                </Text>
                            </Text>

                            {/* weather Image */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={{ uri: 'https:' + current?.condition?.icon }} style={{ height: 300, width: 300 }} />

                                {/* <Image source={require('../assets/partlycloudy.png')} style={{ height: 300, width: 300 }} /> */}
                            </View>
                            {/* Degree View */}
                            <View style={{ marginVertical: 10 }}>
                                <Text style={[tailwind.textCenter, tailwind.fontBold, tailwind.textWhite, tailwind.text6xl, tailwind.mL5]}>
                                    {current?.temp_c}&#176;
                                </Text>
                                <Text style={[tailwind.textCenter, tailwind.trackingWidest, tailwind.textWhite, tailwind.textXl, tailwind.mL5]}>
                                    {current?.condition?.text}
                                </Text>

                            </View>

                            {/* other stats */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Image source={require('../icons/wind.png')} style={[tailwind.h6, tailwind.w6]} />
                                    <Text style={[tailwind.textBase, tailwind.textWhite, tailwind.fontSemibold, { marginStart: 12 }]}>{current?.wind_kph} km</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Image source={require('../icons/drop.png')} style={[tailwind.h6, tailwind.w6]} />
                                    <Text style={[tailwind.textBase, tailwind.textWhite, tailwind.fontSemibold, { marginStart: 12 }]}>{current?.humidity}%</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Image source={require('../icons/sun.png')} style={[tailwind.h6, tailwind.w6]} />
                                    <Text style={[tailwind.textBase, tailwind.textWhite, tailwind.fontSemibold, { marginStart: 12 }]}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                </View>

                            </View>

                        </View>


                        {/* predication for a week  */}
                        <View style={[tailwind.mB2, tailwind.mY5, { marginBottom: 30 }]}>
                            <View style={[tailwind.flexRow, tailwind.itemsCenter, tailwind.mX5, { marginHorizontal: 20 }]}>
                                <CalendarDaysIcon size={22} color='white' />
                                <Text style={[tailwind.textBase, tailwind.textWhite, { marginStart: 10 }]}> Daily Forecast</Text>
                            </View>
                            <ScrollView
                                horizontal
                                contentContainerStyle={{ padding: 15 }}
                                showsHorizontalScrollIndicator={false}>
                                {
                                    weather?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item.date);
                                        let options = { weekday: 'long' };
                                        let dayName = date.toLocaleDateString('en-US', options)
                                        return (
                                            <View
                                                key={index}
                                                style={
                                                    [tailwind.flex, tailwind.justifyCenter, tailwind.itemsCenter, tailwind.w24,
                                                    { paddingVertical: 10, borderRadius: 30, marginVertical: 6, marginStart: 4, backgroundColor: '#575759', opacity: 0.90 }
                                                    ]
                                                }>
                                                <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={{ height: 50, width: 50 }} />
                                                <Text style={{ color: 'white' }}>{dayName}</Text>
                                                <Text style={[tailwind.textWhite, tailwind.fontSemibold, tailwind.textXl]}>{item.day?.avgtemp_c}&#176;</Text>
                                            </View>
                                        )
                                    })
                                }

                            </ScrollView>

                        </View>

                    </SafeAreaView>

                )

            }


        </View>
    );
}


const styles = StyleSheet.create(
    {
        searchBarContainer: {
            marginTop: 20,
            height: 50,
            width: '90%',
            marginStart: 20,
            borderRadius: 30,
        },
        searchIcon: {
            backgroundColor: '#AAA7Ad',
            padding: 10,
            alignItems: 'flex-end',
            borderRadius: 50
        },
        suggestionList: {
            borderRadius: 30,
            alignItems: 'flex-start',
            marginTop: 60

        },
        listText: {
            fontSize: 18,
            color: 'black',
            marginLeft: 20
        }
    }
)


export default Home;