import RakutenTrip from '../src/index';
import dotenv from 'dotenv';

import randomNumber from 'random-number-csprng';

import addYears from 'date-fns/fp/addYears';

import { Currency, Locale, CountryCode } from '../src/isoTypes';

dotenv.config({
	path: `${__dirname}/../.env`,
});

const rakutenTrip = new RakutenTrip({
	apiKey: process.env.RAKUTEN_TRIP_API_KEY || '',
	baseUrlForContent: process.env.RAKUTEN_TRIP_CONTENT_BASE_URL || '',
	baseUrlForBooking: process.env.RAKUTEN_TRIP_BOOKING_BASE_URL || '',
	baseUrlForGuarantee: process.env.RAKUTEN_TRIP_GUARANTEE_BASE_URL || '',
	userAgent: process.env.RAKUTEN_TRIP_USER || '',
});

describe('Rakuten Content API Test', () => {
	it('should pass the assertions', async () => {
		const properties = await rakutenTrip.getMyPropertyList({
			since: addYears(-15)(new Date()),
			page: 1,
			size: 50,
		});

		const property = await rakutenTrip.postProperties({
			extends: {
				long: true,
				rooms: true,
				facilities: true,
				images: true,
			},
			lang: [Locale.en_US],
			propertyCodes: ['TJRf'],
		});

		const facilities = await rakutenTrip.getPropertyFacilities();

		const hotelChangelog = await rakutenTrip.getHotelsChangelog({
			updatedAt: new Date(),
		});
	});
});

describe('Rakuten Booking API Test', () => {
	it('should pass the assertions', async () => {
		const hotelList = await rakutenTrip.getHotelList({
			hotelIdList: ['TJRf'],
			checkInDate: '2021-03-12',
			checkOutDate: '2021-03-14',
			roomCount: 1,
			adultCount: 1,
			currency: Currency.TWD,
			sourceMarket: [CountryCode.TW],
			locale: Locale.zh_Hant_TW,
		});
		console.log('hotelList', JSON.stringify(hotelList));

		const hotelRooms = await rakutenTrip.getHotelRooms({
			hotelId: 'TJRf',
			checkInDate: '2021-03-12',
			checkOutDate: '2021-03-14',
			roomCount: 1,
			adultCount: 1,
			currency: Currency.TWD,
			sourceMarket: [CountryCode.TW],
			locale: Locale.zh_Hant_TW,
			sessionId: hotelList.sessionId,
		});
		console.log('hotelRooms', JSON.stringify(hotelRooms));

		if (hotelRooms.hotels.length > 0) {
			const hotelPackage = hotelRooms.hotels[0].rates.packages[0];
			const bookingPolicy = await rakutenTrip.postBookingPolicy({
				search: {
					hotelId: 'TJRf',
					checkInDate: '2021-03-12',
					checkOutDate: '2021-03-14',
					roomCount: 1,
					adultCount: 1,
					currency: Currency.TWD,
					sourceMarket: [CountryCode.TW],
					locale: Locale.zh_Hant_TW,
				},
				package: hotelPackage,
				sessionId: hotelList.sessionId,
			});
			console.log('bookingPolicy', JSON.stringify(bookingPolicy));

			const bookingPolicyFromAPI = await rakutenTrip.getBookingPolicy({
				bookingPolicyId: bookingPolicy.bookingPolicyId,
				sessionId: hotelList.sessionId,
			});
			console.log('bookingPolicyFromAPI', JSON.stringify(bookingPolicyFromAPI));

			const clientReference = await randomNumber(0, 100000);
			const preBooking = await rakutenTrip.postPreBook({
				bookingPolicyId: bookingPolicy.bookingPolicyId,
				clientReference: `TestOrder-${clientReference}`,
				roomLeadGuests: [
					{
						firstName: 'Test',
						lastName: 'Klockwork',
						nationality: [CountryCode.TW],
					},
				],
				contactPerson: {
					firstName: 'Test',
					lastName: 'Klockwork',
					contactNo: '+886955940336',
				},
				sessionId: hotelList.sessionId,
			});
			console.log('preBooking', JSON.stringify(preBooking));

			const booking = await rakutenTrip.postBook({
				bookingId: preBooking.bookingId,
				sessionId: hotelList.sessionId,
			});
			console.log('booking', JSON.stringify(booking));

			const bookingDataFromAPI = await rakutenTrip.getBookStatus({
				bookingId: booking.bookingId,
				sessionId: hotelList.sessionId,
			});
			console.log('bookingDataFromAPI', JSON.stringify(bookingDataFromAPI));

			const cancelBooking = await rakutenTrip.postCancel({
				bookingId: bookingDataFromAPI.bookingId,
				sessionId: hotelList.sessionId,
			});
			console.log('cancelBooking', JSON.stringify(cancelBooking));
		}
	});
});
