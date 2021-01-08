import format from 'date-fns-tz/format';
import CryptoJS from 'crypto-js';
import phin from 'phin';
import querystring from 'query-string';

import { Currency, Locale, CountryCode } from './isoTypes';

export enum ImageSize {
	XS = 'xs',
	S = 's',
	M = 'm',
	L = 'l',
	XL = 'XL',
}

export enum GetHotelListStatus {
	IN_PROGRESS = 'in-progress',
	COMPLETE = 'complete',
}

export enum HotelRateType {
	NET = 'NET',
	PAY_AT_HOTEL = 'PAY_AT_HOTEL',
	COMMISSIONABLE = 'commissionable',
}

export enum Food {
	ROOM_ONLY = 1,
	BREAKFAST,
	LUNCH,
	DINNER,
	HALF_BOARD, // Marked as not containing breakfast
	FULL_BOARD,
	ALL_INCLUSIVE,
}

export type GetMyPropertyListInput = {
	since: Date;
	page: number;
	size: number;
};

export type GetMyPropertyListMeta = GetMyPropertyListParameters;

export type MyPropertySummary = {
	propertyCode: String;
	isActive: boolean;
	activatedAt: Date;
	deactivatedAt: Date;
};

export type PageItem = {
	page: number;
	size: number;
};

export type Pagination = {
	current: PageItem;
	next: PageItem | null;
};

export type GetMyPropertyListOutput = {
	meta: GetMyPropertyListMeta;
	myPropertyList: MyPropertySummary[];
	pagination: Pagination;
};

export type PostPropertiesInput = {
	extends: {
		long: boolean;
		rooms: boolean;
		facilities: boolean;
		images: boolean;
	};
	lang: Locale[];
	propertyCodes: string[];
};

export type ImageItemLink = {
	method?: string;
	href?: string;
};

export type ImageItem = {
	caption?: string;
	heroImage?: boolean;
	links?: { [key in ImageSize]: ImageItemLink };
};

export type RoomItem = {
	beds: { [bedDescription: string]: number };
	descriptions?: string;
	code?: string;
};

export type PropertyDetails = {
	id: string;
	name: string;
	address: string;
	categoryId: string;
	city: string;
	countryCode: string;
	country: string;
	latitude: number;
	longitude: number;
	rating: number;
	trustyouReviewCount: number;
	trustyouRating: number;
	regionIds: number[];
	heroImages: ImageItem[];
	images: ImageItem[];
	description: string; // HTML string
	website: string;
	checkInTime: string;
	checkoutTime: string;
	stateProvince: string;
	postalCode: string;
	email: string;
	phone: string;
	fax: string;
	policy: string; // HTML string
	rooms: RoomItem[];
	facilities: number[];
};

export type PostPropertiesOutput = {
	[hotelId: string]: PropertyDetails;
};

export type PropertyFacility = {
	code: string;
	description: string;
};

export type GetPropertyFacilitiesOutput = PropertyFacility[];

export type GetHotelsChangelogInput = {
	updatedAt: string;
};

export type GetHotelsChangelogOutput = {
	data: {
		items: number[] | null;
	};
};

export type GetHotelListInput = {
	hotelIdList: string[];
	checkInDate: string;
	checkOutDate: string;
	roomCount: number;
	adultCount: number;
	children?: number[];
	currency: Currency;
	sourceMarket: CountryCode;
	locale?: Locale;
};

export type RoomDetails = {
	roomCode: string;
	ratePlanCode: string;
	description: string;
	supplierDescription: string;
	ratePlanDescription?: string;
	food: Food; // Notice: The food inclusion does not always correspond to the number of people staying in the room
	roomType: string;
	roomView: string;
	beds: { [key: string]: number };
	supplierDescription: string;
	nonRefundable: boolean;
};

export type CancellationPolicyBand = {
	penaltyPercentage: number;
	dateFrom: Date;
	dateTo: Date;
};

export type CancellationPolicy = {
	remarks: string;
	cancellationPolicies: CancellationPolicyBand[];
};

export type Money = {
	currency: Currency;
	value: number;
};

export type TaxesAndFees = {
	total: Money;
	estimateTotal: Money;
};

export type HotelPackage = {
	bookingKey: string;
	hotelId: string;
	rateType: HotelRateType;
	roomDetails: RoomDetails;
	roomRate: number;
	roomRateCurrency: Currency;
	clientCommission: number;
	clientCommissionCurrency: Currency;
	chargeableRate: number;
	chargeableRateCurrency: Currency;
	cancellationPolicy?: CancellationPolicy;
	taxesAndFees?: TaxesAndFees;
	additionalInfo;
	supplier?: string;
};

export type HotelRate = {
	packages: HotelPackage[];
};

export type HotelResult = {
	id: string;
	rates: HotelRate;
};

export type GetHotelListOutput = {
	sessionId: string;
	eventId: string;
	status: GetHotelListStatus;
	search: GetHotelListParameters;
	hotels: HotelResult[];
};

export type GetHotelRoomsInput = {
	hotelId: string;
	checkInDate: string;
	checkOutDate: string;
	roomCount: number;
	adultCount: number;
	children?: number[];
	currency: Currency;
	sourceMarket: CountryCode;
	locale?: Locale;
};

export type GetHotelRoomsOutput = {
	sessionId: string;
	eventId: string;
	status: GetHotelListStatus;
	search: GetHotelListParameters;
	hotels: HotelResult[];
};

export type PostBookingPolicyInput = {
	search: GetHotelRoomsInput;
	package: HotelPackage;
};

export type RakutenTripConstructorInput = {
	apiKey: string;
	baseUrl?: string;
	userAgent?: string;
};

type GetMyPropertyListParameters = {
	since: string;
	page: number;
	size: number;
};

type PostPropertiesParameters = {
	extends: string;
	lang: string;
};

type PostPropertiesBody = {
	property_codes: string[];
};

type GetHotelsChangelogParameters = {
	updatedAt: string;
};

type GetHotelListParameters = {
	hotelIdList: string;
	checkInDate: string;
	checkOutDate: string;
	roomCount: number;
	adultCount: number;
	children?: number[];
	currency: Currency;
	sourceMarket: CountryCode;
	locale?: Locale;
};

type GetHotelRoomsParameters = GetHotelRoomsInput;

type Request = {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
	parameters?:
		| GetMyPropertyListParameters
		| PostPropertiesParameters
		| GetHotelsChangelogParameters
		| GetHotelListParameters
		| GetHotelRoomsParameters;
	body?: PostPropertiesBody;
	requestHeaders?: {
		sessionId?: string;
	};
};

export default class RakutenTrip {
	private apiKey: string;
	private baseUrl: string;
	private userAgent: string;

	constructor(input: RakutenTripConstructorInput) {
		const { apiKey, baseUrl = '', userAgent = '' } = input;
		this.apiKey = apiKey;
		this.baseUrl = baseUrl;
		this.userAgent = userAgent;
	}

	private async request(request: Request) {
		const { url, method, parameters = {}, body, requestHeaders = {} } = request;
		const { sessionId } = requestHeaders;
		const requestUrl = querystring.stringifyUrl({
			url: `${this.baseUrl}${url}`,
			query: parameters,
		});

		const headers: { [key: string]: string } = {
			'accept-encoding': 'gzip',
			'content-type': 'application/json',
			'x-api-key': this.apiKey,
		};
		if (sessionId) {
			headers['x-session'] = sessionId;
		}
		if (this.userAgent) {
			headers['user-agent'] = this.userAgent;
		}

		return await phin({
			url: requestUrl,
			method,
			data: body ? JSON.stringify(body) : '',
			headers,
		});
	}
}
