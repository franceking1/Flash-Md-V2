import axios from 'axios';
import { API_CONFIG } from '../france/config.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
    {
        name: 'country',
        aliases: ['countryinfo', 'nation', 'negara'],
        description: 'Get detailed information about a country',
        category: 'Search',
        execute: async ({ sock, from, text, msg, config }) => {
            const botName = config.BOT_NAME || 'Flash-MD';
            
            if (!text || text.trim() === '') {
                const noCountryMsg = await t(from, 'country', 'noCountry');
                return sock.sendMessage(from, {
                    text: noCountryMsg
                }, { quoted: msg });
            }

            const countryName = text.trim();
            
            const apiUrl = `${API_CONFIG.country.url}?name=${encodeURIComponent(countryName)}`;

            try {
                const fetchingMsg = await t(from, 'country', 'fetching');
                const processingMsg = await sock.sendMessage(from, { text: `${fetchingMsg} ${countryName}...` }, { quoted: msg });

                const response = await axios.get(apiUrl, {
                    timeout: API_CONFIG.country.timeout,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                await sock.sendMessage(from, { delete: processingMsg.key });

                if (!response.data.status || !response.data.data) {
                    const notFoundMsg = await t(from, 'country', 'notFound');
                    return sock.sendMessage(from, {
                        text: `${notFoundMsg} "${countryName}"`
                    }, { quoted: msg });
                }

                const data = response.data.data;
                const userLang = getUserLang(from);
                
                const phoneCode = data.phoneCode || 'N/A';
                const area = data.area ? `${data.area.squareKilometers.toLocaleString()} km² / ${data.area.squareMiles.toLocaleString()} mi²` : 'N/A';
                const neighbors = data.neighbors ? data.neighbors.map(n => n.name).join(', ') : 'None';
                const languages = data.languages?.native ? data.languages.native.join(', ') : 'N/A';
                const coordinates = data.coordinates ? `${data.coordinates.latitude}, ${data.coordinates.longitude}` : 'N/A';
                
                const headerText = await t(from, 'country', 'header');
                const nameLabel = await t(from, 'country', 'name');
                const capitalLabel = await t(from, 'country', 'capital');
                const phoneLabel = await t(from, 'country', 'phoneCode');
                const continentLabel = await t(from, 'country', 'continent');
                const languagesLabel = await t(from, 'country', 'languages');
                const currencyLabel = await t(from, 'country', 'currency');
                const areaLabel = await t(from, 'country', 'area');
                const drivingLabel = await t(from, 'country', 'drivingSide');
                const landlockedLabel = await t(from, 'country', 'landlocked');
                const governmentLabel = await t(from, 'country', 'government');
                const coordinatesLabel = await t(from, 'country', 'coordinates');
                const isoLabel = await t(from, 'country', 'isoCode');
                const mapsLabel = await t(from, 'country', 'googleMaps');
                const famousLabel = await t(from, 'country', 'famousFor');
                const neighborsLabel = await t(from, 'country', 'neighbors');
                const yesText = await t(from, 'country', 'yes');
                const noText = await t(from, 'country', 'no');
                const poweredText = await t(from, 'country', 'powered');
                
                let countryText = `${headerText}\n\n`;
                countryText += `${nameLabel} ${data.name}\n`;
                countryText += `${capitalLabel} ${data.capital || 'N/A'}\n`;
                countryText += `${phoneLabel} ${phoneCode}\n`;
                countryText += `${continentLabel} ${data.continent?.name || 'N/A'} ${data.continent?.emoji || ''}\n`;
                countryText += `${languagesLabel} ${languages}\n`;
                countryText += `${currencyLabel} ${data.currency || 'N/A'}\n`;
                countryText += `${areaLabel} ${area}\n`;
                countryText += `${drivingLabel} ${data.drivingSide || 'N/A'}\n`;
                countryText += `${landlockedLabel} ${data.landlocked ? yesText : noText}\n`;
                countryText += `${governmentLabel} ${data.constitutionalForm || 'N/A'}\n`;
                countryText += `${coordinatesLabel} ${coordinates}\n`;
                countryText += `${isoLabel} ${data.isoCode?.alpha2?.toUpperCase() || 'N/A'}\n`;
                countryText += `${mapsLabel} ${data.googleMapsLink || 'N/A'}\n`;
                countryText += `${famousLabel} ${data.famousFor || 'N/A'}\n`;
                
                if (data.neighbors && data.neighbors.length > 0) {
                    countryText += `${neighborsLabel} ${neighbors}\n`;
                }
                
                countryText += `\n${poweredText} ${botName}`;
                
                if (data.flag) {
                    await sock.sendMessage(from, {
                        image: { url: data.flag },
                        caption: countryText
                    }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: countryText }, { quoted: msg });
                }

            } catch (error) {
                console.error('Country info error:', error);
                const errorMsg = await t(from, 'country', 'error');
                const poweredText = await t(from, 'country', 'powered');
                await sock.sendMessage(from, { 
                    text: `${errorMsg}\n\n${poweredText} ${botName}`
                }, { quoted: msg });
            }
        }
    }
];
