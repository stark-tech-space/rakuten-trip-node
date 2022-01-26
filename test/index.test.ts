import RakutenTrip, {
  Lang,
  Currency,
  CountryCode,
  GetHotelRoomsOutput,
  GetHotelListOutput,
} from '../src/index';
import dotenv from 'dotenv';

import randomNumber from 'random-number-csprng';

import addYears from 'date-fns/fp/addYears';

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
      since: addYears(-3)(new Date()),
      page: 1,
      size: 50,
    });
    // console.log('properties', JSON.stringify(properties));

    const property = await rakutenTrip.postProperties({
      extends: {
        long: true,
        rooms: true,
        facilities: true,
        images: true,
      },
      lang: Lang.zh_CN,
      propertyCodes: [properties.myPropertyList[0].propertyCode],
    });
    console.log('property', JSON.stringify(property));

    const rooms = await rakutenTrip.getRoomsV2({
      propertyCode: properties.myPropertyList[0].propertyCode,
    });
    // console.log('rooms', JSON.stringify(rooms));

    const facilities = await rakutenTrip.getPropertyFacilities();
    // console.log('facilities', JSON.stringify(facilities));

    const hotelChangelog = await rakutenTrip.getHotelsChangelog({
      updatedAt: new Date(),
    });
    // console.log('hotelChangelog', JSON.stringify(hotelChangelog));
  });
});

describe.skip('Rakuten Booking API Test', () => {
  it(
    'should pass the assertions',
    async () => {
      console.log('Get hotel list...');
      let hotelList: GetHotelListOutput;
      do {
        hotelList = await rakutenTrip.getHotelList({
          hotelIdList: ['rndm'],
          checkInDate: '2022-01-27',
          checkOutDate: '2022-01-28',
          roomCount: 1,
          adultCount: 2,
          currency: Currency.CNY,
          sourceMarket: [CountryCode.CN],
          locale: Lang.zh_CN,
        });
      } while (hotelList.hotels.length <= 0);
      console.log('hotelList', JSON.stringify(hotelList));

      console.log('Get hotel rooms (rate plan)...');
      let hotelRooms: GetHotelRoomsOutput;
      do {
        hotelRooms = await rakutenTrip.getHotelRooms({
          hotelId: 'rndm',
          checkInDate: '2022-01-27',
          checkOutDate: '2022-01-28',
          roomCount: 1,
          adultCount: 1,
          currency: Currency.CNY,
          sourceMarket: [CountryCode.CN],
          locale: Lang.zh_CN,
          sessionId: hotelList.sessionId,
        });
      } while (hotelRooms.hotels.length <= 0);
      console.log('hotelRooms', JSON.stringify(hotelRooms));

      if (hotelRooms.hotels.length > 0) {
        console.log('Post Booking Policy...');
        const hotelPackage = hotelRooms.hotels[0].rates.packages[0];
        const bookingPolicy = await rakutenTrip.postBookingPolicy({
          search: {
            hotelId: 'rndm',
            checkInDate: '2022-01-27',
            checkOutDate: '2022-01-28',
            roomCount: 1,
            adultCount: 1,
            currency: Currency.CNY,
            sourceMarket: [CountryCode.CN],
            locale: Lang.zh_CN,
          },
          package: hotelPackage,
          sessionId: hotelList.sessionId,
        });
        console.log('bookingPolicy', JSON.stringify(bookingPolicy));

        console.log('Get Booking Policy...');
        const bookingPolicyFromAPI = await rakutenTrip.getBookingPolicy({
          bookingPolicyId: bookingPolicy.bookingPolicyId,
          sessionId: hotelList.sessionId,
        });
        console.log('bookingPolicyFromAPI', JSON.stringify(bookingPolicyFromAPI));

        console.log('Post PreBook v1...');
        const clientReference = await randomNumber(0, 100000);
        const preBooking = await rakutenTrip.postPreBook({
          bookingPolicyId: bookingPolicy.bookingPolicyId,
          clientReference: `TestOrder-${clientReference}`,
          roomLeadGuests: [
            {
              firstName: 'Test',
              lastName: 'Klockwork',
              nationality: [CountryCode.CN],
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

        console.log('Post PreBook v2...');
        const clientReference2 = await randomNumber(0, 100000);
        const preBooking2 = await rakutenTrip.postPreBook({
          bookingPolicyId: bookingPolicy.bookingPolicyId,
          clientReference: `TestOrder-${clientReference2}`,
          roomLeadGuests: [
            {
              firstName: 'Test',
              lastName: 'Klockwork',
              nationality: [CountryCode.CN],
            },
          ],
          contactPerson: {
            firstName: 'Test',
            lastName: 'Klockwork',
            contactNo: '+886955940336',
          },
          sessionId: hotelList.sessionId,
        });
        console.log('preBooking2', JSON.stringify(preBooking2));

        console.log('Post Book...');
        const booking = await rakutenTrip.postBook({
          bookingId: preBooking.bookingId,
          sessionId: hotelList.sessionId,
        });
        console.log('booking', JSON.stringify(booking));

        console.log('Get Book Status...');
        const bookingDataFromAPI = await rakutenTrip.getBookStatus({
          bookingId: booking.bookingId,
          sessionId: hotelList.sessionId,
        });
        console.log('bookingDataFromAPI', JSON.stringify(bookingDataFromAPI));

        console.log('Post Cancel...');
        const cancelBooking = await rakutenTrip.postCancel({
          bookingId: booking.bookingId,
          sessionId: hotelList.sessionId,
        });
        console.log('cancelBooking', JSON.stringify(cancelBooking));
      }
    },
    60 * 60 * 1000,
  );
});
