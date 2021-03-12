import parseISO from 'date-fns/fp/parseISO';
import formatISO from 'date-fns/fp/formatISO';
import querystring from 'query-string';
import fetch, { RequestInit, Headers } from 'node-fetch';

import { Currency, CountryCode } from './isoTypes';

export * from './isoTypes';

export enum ApiCategory {
	CONTENT,
	BOOKING,
	GUARANTEE,
}

export enum Lang {
	en_US = 'en-US',
	ja_JP = 'ja-JP',
	zh_CN = 'zh-CN',
}

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

export enum BookingStatus {
	INIT = 'bkg-ns',
	IN_PROGRESS = 'bkg-ip',
	CONFIRMED = 'bkg-cf',
	CANCELLED = 'bkg-cx',
	FAILED = 'bkg-af',
	CONFIRMED_AT_SUPPLIER = 'bkg-ps',
}

export enum BookingCardType {
	AMEX = 'AMEX',
	BC = 'BC',
	Dankort = 'Dankort',
	DinersClub = 'DinersClub',
	Discover = 'Discover',
	Electron = 'Electron',
	Elo = 'Elo',
	Hipercard = 'Hipercard',
	JCB = 'JCB',
	Maestro = 'Maestro',
	MasterCard = 'MasterCard',
	UATP = 'UATP',
	UnionPay = 'UnionPay',
	Visa = 'Visa',
}

export type GetMyPropertyListInput = {
	since: Date;
	page: number;
	size: number;
};

export type GetMyPropertyListMeta = {
	query: GetMyPropertyListParameters;
};

export type MyPropertySummary = {
	propertyCode: string;
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
	lang: Lang;
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
	checkOutTime: string;
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
	updatedAt: Date;
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
	sourceMarket: CountryCode[];
	locale?: Lang;
	sessionId?: string;
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
	// supplierDescription: string;
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
	search: GetHotelListInput;
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
	sourceMarket: CountryCode[];
	locale?: Lang;
	sessionId?: string;
};

export type GetHotelRoomsOutput = {
	sessionId: string;
	eventId: string;
	status: GetHotelListStatus;
	search: GetHotelRoomsInput;
	hotels: HotelResult[];
};

export type PostBookingPolicyInput = {
	search: GetHotelRoomsInput;
	package: HotelPackage;
	sessionId?: string;
};

export type PostBookingPolicyOutput = {
	sessionId: string;
	eventId: string;
	bookingPolicyId: string;
	cancellationPolicy: CancellationPolicy;
	package: HotelPackage;
	checkInInstructions?: string;
	hotelFees?: { [feeDescription: string]: Money };
};

export type GetBookingPolicyInput = {
	bookingPolicyId: string;
	sessionId?: string;
};

export type GetBookingPolicyOutput = {
	sessionId: string;
	eventId: string;
	bookingPolicyId: string;
	cancellationPolicy: CancellationPolicy;
	package: HotelPackage;
	request: {
		search: GetHotelRoomsInput;
		package: HotelPackage;
	};
	checkInInstructions?: string;
	hotelFees?: { [feeDescription: string]: Money };
};

export type RoomLeadGuestRequest = {
	salutation?: string;
	firstName: string;
	lastName: string;
	nationality: CountryCode[];
	remarks?: string;
};

export type RoomLeadGuestResponse = {
	salutation: string;
	firstName: string;
	lastName: string;
	nationality: CountryCode[];
	remarks: string;
};

export type ContactPersonRequest = {
	salutation?: string;
	firstName: string;
	lastName: string;
	contactNo: string;
	email?: string;
	city?: string;
	state?: string;
	street?: string;
	postalCode?: string;
	country?: CountryCode;
	nationality?: CountryCode[];
};

export type PostPreBookInput = {
	bookingPolicyId: string;
	clientReference: string;
	roomLeadGuests: RoomLeadGuestRequest[];
	contactPerson: ContactPersonRequest;
	sessionId?: string;
};

export type BookingDetails = {
	customerReference: string;
	customerBookingId: string;
	hotelConfirmationId?: string;
	additionalPolicy?: string;
	additionalCheckInInstruction?: string;
};

export type BookingRecordPackage = {
	hotelId: string;
	checkInLocal: string;
	checkOutLocal: string;
	adultCount: number;
	roomCount: number;
	children?: number[];
	rateType: HotelRateType;
	roomDetails: RoomDetails;
	roomRate: number;
	roomRateCurrency: Currency;
	clientCommission: number;
	clientCommissionCurrency: Currency;
	chargeableRate: number;
	chargeableRateCurrency: Currency;
	taxesAndFees?: TaxesAndFees;
	checkInInstructions?: string;
	hotelFees?: { [feeDescription: string]: Money };
};

export type CancellationDetails = {
	cancelledAt: Date;
	apiPenalty: Money;
	apiPenaltyPercentage: number;
	cancellationNote?: string;
};

export type ContactPersonResponse = {
	salutation: string;
	firstName: string;
	lastName: string;
	contactNo: string;
	email: string;
	city: string;
	state: string;
	street: string;
	postalCode: string;
	country: CountryCode;
	nationality: CountryCode[];
};

export type BookingRecord = {
	sessionId: string;
	eventId: string;
	bookingId: string;
	clientReference: string;
	status: BookingStatus;
	requestedAt: Date;
	confirmedAt?: Date;
	bookingDetails: BookingDetails;
	package: BookingRecordPackage;
	cancellationPolicy: CancellationPolicy;
	cancellationDetails?: CancellationDetails;
	contactPerson: ContactPersonResponse;
	roomLeadGuests: RoomLeadGuestResponse[];
	sourceMarket: CountryCode[];
	locale: Lang;
	isCustomer: boolean;
	credentialTag?: string;
	supplierName?: string;
	partnerCode?: string;
	partnerName?: string;
	supplierCode?: string;
	supplierHotelId?: string;
};

export type PostPreBookOutput = BookingRecord;

export type PostBookInput = {
	bookingId: string;
	encryptedCard?: {
		token: string;
		tokenizeProvider: 'PCI-BOOKING';
		cardType: BookingCardType;
	};
	sessionId?: string;
};

export type PostBookOutput = BookingRecord;

export type GetBookStatusInput = {
	bookingId: string;
	sessionId?: string;
};

export type GetBookStatusOutput = BookingRecord;

export type PostCancelInput = {
	bookingId: string;
	sessionId?: string;
};

export type PostCancelOutput = BookingRecord;

export type CardInfo = {
	cardNo: string;
	cardType: BookingCardType;
	name: string;
	expMM: string;
	expYY: string;
	cvc: string;
};

export type PostPaymentGuaranteeInput = {
	bookingId: string;
	cardInfo: CardInfo;
	sessionId?: string;
};

export type PostPaymentGuaranteeOutput = {
	bookingId: string;
	guaranteeId: string;
};

export type RakutenTripConstructorInput = {
	apiKey: string;
	baseUrlForContent: string;
	baseUrlForBooking: string;
	baseUrlForGuarantee: string;
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
	updated_at: string;
};

type GetHotelListParameters = {
	hotel_id_list: string;
	check_in_date: string;
	check_out_date: string;
	room_count: number;
	adult_count: number;
	children?: number[];
	currency: Currency;
	source_market: string;
	locale?: Lang;
};

type GetHotelRoomsParameters = {
	hotel_id: string;
	check_in_date: string;
	check_out_date: string;
	room_count: number;
	adult_count: number;
	children?: number[];
	currency: Currency;
	source_market: string;
	locale?: Lang;
};

type HotelPackageResponse = {
	booking_key: string;
	hotel_id: string;
	rate_type: HotelRateType;
	room_details: {
		room_code: string;
		rate_plan_code: string;
		description: string;
		supplier_description: string;
		rate_plan_description?: string;
		food: Food; // Notice: The food inclusion does not always correspond to the number of people staying in the room
		room_type: string;
		room_view: string;
		beds: { [key: string]: number };
		// supplierDescription: string;
		non_refundable: boolean;
	};
	room_rate: number;
	room_rate_currency: Currency;
	client_commission: number;
	client_commission_currency: Currency;
	chargeable_rate: number;
	chargeable_rate_currency: Currency;
	cancellation_policy?: {
		remarks: string;
		cancellation_policies: {
			penalty_percentage: number;
			date_from: string;
			date_to: string;
		}[];
	};
	taxes_and_fees?: {
		total: Money;
		estimate_total: Money;
	};
	supplier?: string;
};

type PostBookingPolicyBody = {
	search: GetHotelRoomsParameters;
	package: HotelPackageResponse;
};

type PostPreBookBody = {
	booking_policy_id: string;
	client_reference: string;
	room_lead_guests: {
		salutation?: string;
		first_name: string;
		last_name: string;
		nationality: string;
		remarks?: string;
	}[];
	contact_person: {
		salutation?: string;
		first_name: string;
		last_name: string;
		contact_no: string;
		email?: string;
		city?: string;
		state?: string;
		street?: string;
		postal_code?: string;
		country?: string;
		nationality?: string;
	};
};

type PostBookBody = {
	encrypted_card?: {
		token: string;
		tokenize_provider: 'PCI-BOOKING';
		card_type: BookingCardType;
	};
};

type PostCancelBody = {
	booking_id: string;
};

type BookingRecordResponse = {
	session_id: string;
	event_id: string;
	booking_id: string;
	client_reference: string;
	status: BookingStatus;
	requested_at: string;
	confirmed_at?: string;
	booking_details: {
		customer_reference: string;
		customer_booking_id: string;
		hotel_confirmation_id?: string;
		additional_policy?: string;
		additional_check_in_instruction?: string;
	};
	package: {
		hotel_id: string;
		check_in_local: string;
		check_out_local: string;
		adult_count: number;
		room_count: number;
		children?: number[];
		rate_type: HotelRateType;
		room_details: {
			room_code: string;
			rate_plan_code: string;
			description: string;
			supplier_description: string;
			rate_plan_description?: string;
			food: Food; // Notice: The food inclusion does not always correspond to the number of people staying in the room
			room_type: string;
			room_view: string;
			beds: { [key: string]: number };
			// supplierDescription: string;
			non_refundable: boolean;
		};
		room_rate: number;
		room_rate_currency: Currency;
		client_commission: number;
		client_commission_currency: Currency;
		chargeable_rate: number;
		chargeable_rate_currency: Currency;
		taxes_and_fees?: {
			total: Money;
			estimate_total: Money;
		};
		check_in_instructions?: string;
		hotel_fees?: { [feeDescription: string]: Money };
	};
	cancellation_policy: {
		remarks: string;
		cancellation_policies: {
			penalty_percentage: number;
			date_from: string;
			date_to: string;
		}[];
	};
	cancellation_details?: {
		cancelled_at: string;
		api_penalty: Money;
		api_penalty_percentage: number;
		cancellation_note?: string;
	};
	contact_person: {
		salutation: string;
		first_name: string;
		last_name: string;
		contact_no: string;
		email: string;
		city: string;
		state: string;
		street: string;
		postal_code: string;
		country: CountryCode;
		nationality: string;
	};
	room_lead_guests: {
		salutation: string;
		first_name: string;
		last_name: string;
		nationality: string;
		remarks: string;
	}[];
	source_market: string;
	locale: Lang;
	is_customer: boolean;
	credential_tag?: string;
	supplier_name?: string;
	partner_code?: string;
	partner_name?: string;
	supplier_code: string;
	supplier_hotel_id: string;
};

type PostPaymentGuaranteeBody = {
	booking_id: string;
	card_info: {
		card_no: string;
		card_type: BookingCardType;
		name: string;
		exp_mm: string;
		exp_yy: string;
		cvc: string;
	};
};

type Request = {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
	parameters?:
		| GetMyPropertyListParameters
		| PostPropertiesParameters
		| GetHotelsChangelogParameters
		| GetHotelListParameters
		| GetHotelRoomsParameters;
	requestBody?:
		| PostPropertiesBody
		| PostBookingPolicyBody
		| PostPreBookBody
		| PostBookBody
		| PostCancelBody
		| PostPaymentGuaranteeBody;
	requestHeaders?: {
		sessionId?: string;
	};
};

export default class RakutenTrip {
	private apiKey: string;
	private baseUrlForContent: string;
	private baseUrlForBooking: string;
	private baseUrlForGuarantee: string;
	private userAgent: string;

	constructor(input: RakutenTripConstructorInput) {
		const {
			apiKey,
			baseUrlForContent = '',
			baseUrlForBooking = '',
			baseUrlForGuarantee = '',
			userAgent = '',
		} = input;
		this.apiKey = apiKey;
		this.baseUrlForContent = baseUrlForContent;
		this.baseUrlForBooking = baseUrlForBooking;
		this.baseUrlForGuarantee = baseUrlForGuarantee;
		this.userAgent = userAgent;
	}

	private async request(request: Request, category: ApiCategory): Promise<any> {
		const {
			url,
			method,
			parameters = {},
			requestBody,
			requestHeaders = {},
		} = request;
		const { sessionId } = requestHeaders;

		let baseUrl = '';
		switch (category) {
			case ApiCategory.CONTENT:
				baseUrl = this.baseUrlForContent;
				break;
			case ApiCategory.BOOKING:
				baseUrl = this.baseUrlForBooking;
				break;
			case ApiCategory.GUARANTEE:
				baseUrl = this.baseUrlForGuarantee;
		}

		const requestUrl = querystring.stringifyUrl({
			url: `${baseUrl}${url}`,
			query: parameters,
		});

		const headers: HeadersInit = {
			'Accept-Encoding': 'gzip, deflate, br',
			Connection: 'keep-alive',
			Accept: '*/*',
			'X-Api-Key': this.apiKey,
		};
		if (sessionId) {
			headers['X-Session'] = sessionId;
		}
		if (this.userAgent && category === ApiCategory.CONTENT) {
			headers['User-Agent'] = this.userAgent;
		}

		const requestConfig: RequestInit = {
			method,
			headers: new Headers(headers),
		};
		if (method !== 'GET') {
			requestConfig.body = requestBody ? JSON.stringify(requestBody) : '';
		}
		const response = await fetch(requestUrl, requestConfig);

		const { status = 500 } = response;
		const body = await response.json();
		if (status < 200 || status >= 400) {
			console.log('Error: ', JSON.stringify(body));
			throw new Error(`Error: HTTP Request Failed with status code: ${status}`);
		}

		return body;
	}

	private hotelPackageTransformation(hotelPackage: HotelPackageResponse) {
		const {
			booking_key,
			hotel_id,
			rate_type,
			room_details,
			room_rate,
			room_rate_currency,
			client_commission,
			client_commission_currency,
			chargeable_rate,
			chargeable_rate_currency,
			cancellation_policy: packageCancellationPolicy,
			taxes_and_fees,
			supplier: hotelPackageSupplier,
		} = hotelPackage;

		const {
			room_code,
			rate_plan_code,
			description: roomDetailDescription,
			supplier_description,
			rate_plan_description,
			food: roomDetailFood,
			room_type,
			room_view,
			beds: roomDetailBeds,
			// supplierDescription,
			non_refundable,
		} = room_details;

		const hotelPackageTransformed: HotelPackage = {
			bookingKey: booking_key,
			hotelId: hotel_id,
			rateType: rate_type,
			roomDetails: {
				roomCode: room_code,
				ratePlanCode: rate_plan_code,
				description: roomDetailDescription,
				supplierDescription: supplier_description,
				ratePlanDescription: rate_plan_description,
				food: roomDetailFood,
				roomType: room_type,
				roomView: room_view,
				beds: roomDetailBeds,
				nonRefundable: non_refundable,
			},
			roomRate: room_rate,
			roomRateCurrency: room_rate_currency,
			clientCommission: client_commission,
			clientCommissionCurrency: client_commission_currency,
			chargeableRate: chargeable_rate,
			chargeableRateCurrency: chargeable_rate_currency,
		};

		if (packageCancellationPolicy) {
			const { remarks, cancellation_policies } = packageCancellationPolicy;
			const cancellationPolicies = cancellation_policies.map(
				(packageCancellationPolicy: {
					penalty_percentage: number;
					date_from: string;
					date_to: string;
				}) => {
					const {
						penalty_percentage: penaltyPercentage,
						date_from,
						date_to,
					} = packageCancellationPolicy;

					return {
						penaltyPercentage,
						dateFrom: parseISO(date_from),
						dateTo: parseISO(date_to),
					};
				}
			);

			hotelPackageTransformed.cancellationPolicy = {
				remarks,
				cancellationPolicies,
			};
		}

		if (taxes_and_fees) {
			const { total, estimate_total: estimateTotal } = taxes_and_fees;

			hotelPackageTransformed.taxesAndFees = {
				total,
				estimateTotal,
			};
		}

		if (hotelPackageSupplier) {
			hotelPackageTransformed.supplier = hotelPackageSupplier;
		}

		return hotelPackageTransformed;
	}

	private bookingRecordTransformation(bookingRecord: BookingRecordResponse) {
		const {
			session_id: sessionId,
			event_id: eventId,
			booking_id: bookingId,
			client_reference: clientReference,
			status,
			requested_at,
			confirmed_at,
			booking_details: {
				customer_reference: customerReference,
				customer_booking_id: customerBookingId,
				hotel_confirmation_id: hotelConfirmationId,
				additional_policy: additionalPolicy,
				additional_check_in_instruction: additionalCheckInInstruction,
			},
			package: {
				hotel_id: hotelId,
				check_in_local: checkInLocal,
				check_out_local: checkOutLocal,
				adult_count: adultCount,
				room_count: roomCount,
				children,
				rate_type: rateType,
				room_details: {
					room_code: roomCode,
					rate_plan_code: ratePlanCode,
					description,
					supplier_description: supplierDescription,
					rate_plan_description: ratePlanDescription,
					food, // Notice: The food inclusion does not always correspond to the number of people staying in the room
					room_type: roomType,
					room_view: roomView,
					beds,
					// supplierDescription,
					non_refundable: nonRefundable,
				},
				room_rate: roomRate,
				room_rate_currency: roomRateCurrency,
				client_commission: clientCommission,
				client_commission_currency: clientCommissionCurrency,
				chargeable_rate: chargeableRate,
				chargeable_rate_currency: chargeableRateCurrency,
				taxes_and_fees: taxesAndFees,
				check_in_instructions: checkInInstructions,
				hotel_fees: hotelFees,
			},
			cancellation_policy: {
				remarks,
				cancellation_policies: cancellationPolicies,
			},
			cancellation_details,
			contact_person: {
				salutation: contactPersonSalutation,
				first_name: contactPersonFirstName,
				last_name: contactPersonLastName,
				contact_no: contactPersonNo,
				email: contactPersonEmail,
				city: contactPersonCity,
				state: contactPersonState,
				street: contactPersonStreet,
				postal_code: contactPersonPostalCode,
				country: contactPersonCountry,
				nationality: contactPersonNationality,
			},
			room_lead_guests: roomLeadGuests,
			source_market: sourceMarket,
			locale,
			is_customer: isCustomer,
			credential_tag: credentialTag,
			supplier_name: supplierName,
			partner_code: partnerCode,
			partner_name: partnerName,
			supplier_code: supplierCode,
			supplier_hotel_id: supplierHotelId,
		} = bookingRecord;

		const transformed: BookingRecord = {
			sessionId,
			eventId,
			bookingId,
			clientReference,
			status,
			requestedAt: parseISO(requested_at),
			bookingDetails: {
				customerReference,
				customerBookingId,
				hotelConfirmationId,
				additionalPolicy,
				additionalCheckInInstruction,
			},
			package: {
				hotelId,
				checkInLocal,
				checkOutLocal,
				adultCount,
				roomCount,
				children,
				rateType,
				roomDetails: {
					roomCode,
					ratePlanCode,
					description,
					supplierDescription,
					ratePlanDescription,
					food,
					roomType,
					roomView,
					beds,
					nonRefundable,
				},
				roomRate,
				roomRateCurrency,
				clientCommission,
				clientCommissionCurrency,
				chargeableRate,
				chargeableRateCurrency,
				checkInInstructions,
				hotelFees,
			},
			cancellationPolicy: {
				remarks,
				cancellationPolicies: cancellationPolicies.map(
					({ penalty_percentage, date_from, date_to }) => ({
						penaltyPercentage: penalty_percentage,
						dateFrom: parseISO(date_from),
						dateTo: parseISO(date_to),
					})
				),
			},
			contactPerson: {
				salutation: contactPersonSalutation,
				firstName: contactPersonFirstName,
				lastName: contactPersonLastName,
				contactNo: contactPersonNo,
				email: contactPersonEmail,
				city: contactPersonCity,
				state: contactPersonState,
				street: contactPersonStreet,
				postalCode: contactPersonPostalCode,
				country: contactPersonCountry,
				nationality: contactPersonNationality.split(',') as CountryCode[],
			},
			roomLeadGuests: roomLeadGuests.map(
				({ salutation, first_name, last_name, nationality, remarks }) => ({
					salutation,
					firstName: first_name,
					lastName: last_name,
					nationality: nationality.split(',') as CountryCode[],
					remarks,
				})
			),
			sourceMarket: sourceMarket.split(',') as CountryCode[],
			locale,
			isCustomer,
			credentialTag,
			supplierName,
			partnerCode,
			partnerName,
			supplierCode,
			supplierHotelId,
		};

		if (confirmed_at) {
			transformed.confirmedAt = parseISO(confirmed_at);
		}

		if (taxesAndFees) {
			transformed.package.taxesAndFees = {
				total: taxesAndFees.total,
				estimateTotal: taxesAndFees.estimate_total,
			};
		}

		if (cancellation_details) {
			const {
				cancelled_at: cancelledAt,
				api_penalty: apiPenalty,
				api_penalty_percentage: apiPenaltyPercentage,
				cancellation_note: cancellationNote,
			} = cancellation_details;

			transformed.cancellationDetails = {
				cancelledAt: parseISO(cancelledAt),
				apiPenalty,
				apiPenaltyPercentage,
				cancellationNote,
			};
		}

		return transformed;
	}

	async getMyPropertyList(
		input: GetMyPropertyListInput
	): Promise<GetMyPropertyListOutput> {
		const requestParams: GetMyPropertyListParameters = {
			...input,
			since: formatISO(input.since),
		};

		const { meta, my_property_list, pagination } = await this.request(
			{
				url: '/my-property-list',
				method: 'GET',
				parameters: requestParams,
			},
			ApiCategory.CONTENT
		);

		return {
			meta,
			pagination,
			myPropertyList: my_property_list.map(
				(property: {
					property_code: string;
					is_active: boolean;
					activated_at: string;
					deactivated_at: string;
				}) => {
					const {
						property_code,
						is_active,
						activated_at,
						deactivated_at,
					} = property;
					return {
						propertyCode: property_code,
						isActive: is_active,
						activatedAt: parseISO(activated_at),
						deactivatedAt: parseISO(deactivated_at),
					};
				}
			),
		};
	}

	async postProperties(
		input: PostPropertiesInput
	): Promise<PostPropertiesOutput> {
		const {
			extends: { long, rooms, facilities, images },
			lang,
			propertyCodes,
		} = input;

		let propertyExtends = new Array<string>();
		if (long) {
			propertyExtends.push('long');
		}

		if (rooms) {
			propertyExtends.push('rooms');
		}

		if (facilities) {
			propertyExtends.push('facilities');
		}

		if (images) {
			propertyExtends.push('images');
		}

		if (propertyExtends.length <= 0) {
			throw new Error(`At Least Choose One Extends`);
		}

		const requestParams: PostPropertiesParameters = {
			extends: propertyExtends.join(','),
			lang,
		};
		const requestBody: PostPropertiesBody = {
			property_codes: propertyCodes,
		};

		const response: { [hotelId: string]: any } = await this.request(
			{
				url: '/properties',
				method: 'POST',
				parameters: requestParams,
				requestBody,
			},
			ApiCategory.CONTENT
		);

		let output: PostPropertiesOutput = {};
		Object.keys(response).forEach((hotelId) => {
			const hotelResponse = response[hotelId];

			const {
				id,
				name,
				address,
				category_id,
				city,
				country_code,
				country,
				latitude,
				longitude,
				rating,
				trustyou_review_count,
				trustyou_rating,
				region_ids,
				hero_images,
				images: imagesResponse,
				description, // HTML string
				website,
				check_in_time,
				check_out_time,
				state_province,
				postal_code,
				email,
				phone,
				fax,
				policy, // HTML string
				rooms,
				facilities,
			} = hotelResponse;

			const imageMappingFunction = (image: {
				caption: string;
				hero_image: boolean;
				links: { [key in ImageSize]: ImageItemLink };
			}) => {
				const { caption, hero_image, links } = image;
				return {
					caption,
					heroImage: hero_image,
					links,
				};
			};
			const heroImages: ImageItem[] = (hero_images || []).map(
				imageMappingFunction
			);
			const images: ImageItem[] = imagesResponse.map(imageMappingFunction);

			// const heroImages =
			output[hotelId] = {
				id,
				name,
				address,
				categoryId: category_id,
				city,
				countryCode: country_code,
				country,
				latitude,
				longitude,
				rating,
				trustyouReviewCount: trustyou_review_count,
				trustyouRating: trustyou_rating,
				regionIds: region_ids,
				heroImages,
				images,
				description, // HTML string
				website,
				checkInTime: check_in_time,
				checkOutTime: check_out_time,
				stateProvince: state_province,
				postalCode: postal_code,
				email,
				phone,
				fax,
				policy, // HTML string
				rooms: rooms || [],
				facilities,
			};
		});

		return output;
	}

	async getPropertyFacilities(): Promise<GetPropertyFacilitiesOutput> {
		return await this.request(
			{
				url: '/property-facilities',
				method: 'GET',
			},
			ApiCategory.CONTENT
		);
	}

	async getHotelsChangelog(input: GetHotelsChangelogInput) {
		const requestParams: GetHotelsChangelogParameters = {
			updated_at: formatISO(input.updatedAt),
		};

		return await this.request(
			{
				url: '/property-facilities',
				method: 'GET',
				parameters: requestParams,
			},
			ApiCategory.CONTENT
		);
	}

	async getHotelList(input: GetHotelListInput): Promise<GetHotelListOutput> {
		const {
			hotelIdList,
			checkInDate,
			checkOutDate,
			roomCount,
			adultCount,
			children = [],
			currency,
			sourceMarket,
			locale,
			sessionId,
		} = input;

		const requestParams: GetHotelListParameters = {
			hotel_id_list: hotelIdList.join(','),
			check_in_date: checkInDate,
			check_out_date: checkOutDate,
			room_count: roomCount,
			adult_count: adultCount,
			children,
			currency,
			source_market: sourceMarket.join(','),
			locale,
		};

		const { session_id, event_id, status, search, hotels } = await this.request(
			{
				url: '/hotel_list',
				method: 'GET',
				parameters: requestParams,
				requestHeaders: {
					sessionId: sessionId,
				},
			},
			ApiCategory.BOOKING
		);

		const searchInResponse: GetHotelListInput = {
			hotelIdList: search.hotel_id_list,
			checkInDate: search.check_in_date,
			checkOutDate: search.check_out_date,
			roomCount: search.room_count,
			adultCount: search.adult_count,
			currency,
			sourceMarket: search.source_market,
			locale,
		};

		const hotelsResponse: HotelResult[] = hotels.map(
			(hotel: {
				id: string;
				rates: {
					packages: HotelPackageResponse[];
				};
			}) => {
				const { id: hotelId, rates } = hotel;
				return {
					id: hotelId,
					rates: {
						packages: rates.packages.map((hotelPackage) =>
							this.hotelPackageTransformation(hotelPackage)
						),
					},
				};
			}
		);

		return {
			sessionId: session_id,
			eventId: event_id,
			status,
			search: searchInResponse,
			hotels: hotelsResponse,
		};
	}

	async getHotelRooms(input: GetHotelRoomsInput): Promise<GetHotelRoomsOutput> {
		const {
			hotelId: hotel_id,
			checkInDate: check_in_date,
			checkOutDate: check_out_date,
			roomCount: room_count,
			adultCount: adult_count,
			children = [],
			currency,
			sourceMarket: source_market,
			locale = Lang.en_US,
			sessionId,
		} = input;

		const requestParams: GetHotelRoomsParameters = {
			hotel_id,
			check_in_date,
			check_out_date,
			room_count,
			adult_count,
			children,
			currency,
			source_market: source_market.join(','),
			locale,
		};
		const { session_id, event_id, status, search, hotels } = await this.request(
			{
				url: '/hotel_rooms',
				method: 'GET',
				parameters: requestParams,
				requestHeaders: {
					sessionId: sessionId,
				},
			},
			ApiCategory.BOOKING
		);

		const searchInResponse: GetHotelRoomsInput = {
			hotelId: search.hotel_id,
			checkInDate: search.check_in_date,
			checkOutDate: search.check_out_date,
			roomCount: search.room_count,
			adultCount: search.adult_count,
			currency,
			sourceMarket: search.source_market.split(','),
			locale,
		};

		const hotelsResponse: HotelResult[] = hotels.map(
			(hotel: {
				id: string;
				rates: {
					packages: HotelPackageResponse[];
				};
			}) => {
				const { id: hotelId, rates } = hotel;
				return {
					id: hotelId,
					rates: {
						packages: rates.packages.map((hotelPackage) =>
							this.hotelPackageTransformation(hotelPackage)
						),
					},
				};
			}
		);

		return {
			sessionId: session_id,
			eventId: event_id,
			status,
			search: searchInResponse,
			hotels: hotelsResponse,
		};
	}

	async postBookingPolicy(
		input: PostBookingPolicyInput
	): Promise<PostBookingPolicyOutput> {
		const {
			search: {
				hotelId: searchHotelId,
				checkInDate,
				checkOutDate,
				roomCount,
				adultCount,
				children = [],
				currency,
				sourceMarket,
				locale,
			},
			package: {
				bookingKey,
				hotelId,
				rateType,
				roomDetails: {
					roomCode,
					ratePlanCode,
					description,
					supplierDescription,
					ratePlanDescription,
					food,
					roomType,
					roomView,
					beds,
					nonRefundable,
				},
				roomRate,
				roomRateCurrency,
				clientCommission,
				clientCommissionCurrency,
				chargeableRate,
				chargeableRateCurrency,
				cancellationPolicy,
				taxesAndFees,
				supplier,
			},
			sessionId,
		} = input;

		if (searchHotelId !== hotelId) {
			throw new Error('Hotel Id is different from "search" and "package"');
		}

		const requestBody: {
			search: GetHotelRoomsParameters;
			package: HotelPackageResponse;
		} = {
			search: {
				hotel_id: searchHotelId,
				check_in_date: checkInDate,
				check_out_date: checkOutDate,
				room_count: roomCount,
				adult_count: adultCount,
				children,
				currency,
				source_market: sourceMarket.join(','),
				locale,
			},
			package: {
				booking_key: bookingKey,
				hotel_id: hotelId,
				rate_type: rateType,
				room_details: {
					room_code: roomCode,
					rate_plan_code: ratePlanCode,
					description,
					supplier_description: supplierDescription,
					rate_plan_description: ratePlanDescription,
					food,
					room_type: roomType,
					room_view: roomView,
					beds,
					non_refundable: nonRefundable,
				},
				room_rate: roomRate,
				room_rate_currency: roomRateCurrency,
				client_commission: clientCommission,
				client_commission_currency: clientCommissionCurrency,
				chargeable_rate: chargeableRate,
				chargeable_rate_currency: chargeableRateCurrency,
			},
		};

		if (cancellationPolicy) {
			requestBody.package.cancellation_policy = {
				remarks: cancellationPolicy.remarks,
				cancellation_policies: cancellationPolicy.cancellationPolicies.map(
					({ penaltyPercentage, dateFrom, dateTo }) => ({
						penalty_percentage: penaltyPercentage,
						date_from: formatISO(dateFrom),
						date_to: formatISO(dateTo),
					})
				),
			};
		}

		if (taxesAndFees) {
			requestBody.package.taxes_and_fees = {
				total: taxesAndFees.total,
				estimate_total: taxesAndFees.estimateTotal,
			};
		}

		if (supplier) {
			requestBody.package.supplier = supplier;
		}

		const {
			session_id,
			event_id,
			booking_policy_id,
			cancellation_policy,
			package: hotelPackage,
			check_in_instructions,
			hotel_fees,
		} = await this.request(
			{
				url: '/booking_policy',
				method: 'POST',
				requestBody,
				requestHeaders: {
					sessionId: sessionId,
				},
			},
			ApiCategory.BOOKING
		);

		const output: PostBookingPolicyOutput = {
			sessionId: session_id,
			eventId: event_id,
			bookingPolicyId: booking_policy_id,
			cancellationPolicy: {
				remarks: cancellation_policy.remarks,
				cancellationPolicies: cancellation_policy.cancellation_policies.map(
					(policy: {
						penalty_percentage: string;
						date_from: string;
						date_to: string;
					}) => ({
						penaltyPercentage: policy.penalty_percentage,
						dateFrom: parseISO(policy.date_from),
						dateTo: parseISO(policy.date_to),
					})
				),
			},
			package: this.hotelPackageTransformation(hotelPackage),
		};
		if (check_in_instructions) {
			output.checkInInstructions = check_in_instructions;
		}
		if (hotel_fees) {
			output.hotelFees = hotel_fees;
		}

		return output;
	}

	async getBookingPolicy(
		input: GetBookingPolicyInput
	): Promise<GetBookingPolicyOutput> {
		const { bookingPolicyId } = input;

		const {
			session_id,
			event_id,
			booking_policy_id,
			cancellation_policy,
			package: hotelPackage,
			request: { search: bookingPolicyParam, package: hotelPackageForSearch },
			check_in_instructions,
			hotel_fees,
		} = await this.request(
			{
				url: `/booking_policy/${bookingPolicyId}`,
				method: 'GET',
			},
			ApiCategory.BOOKING
		);

		const searchInResponse: GetHotelRoomsInput = {
			hotelId: bookingPolicyParam.hotel_id,
			checkInDate: bookingPolicyParam.check_in_date,
			checkOutDate: bookingPolicyParam.check_out_date,
			roomCount: bookingPolicyParam.room_count,
			adultCount: bookingPolicyParam.adult_count,
			currency: bookingPolicyParam.currency,
			sourceMarket: bookingPolicyParam.source_market.split(','),
			locale: bookingPolicyParam.locale,
		};

		const output: GetBookingPolicyOutput = {
			sessionId: session_id,
			eventId: event_id,
			bookingPolicyId: booking_policy_id,
			cancellationPolicy: {
				remarks: cancellation_policy.remarks,
				cancellationPolicies: cancellation_policy.cancellation_policies.map(
					(policy: {
						penalty_percentage: string;
						date_from: string;
						date_to: string;
					}) => ({
						penaltyPercentage: policy.penalty_percentage,
						dateFrom: parseISO(policy.date_from),
						dateTo: parseISO(policy.date_to),
					})
				),
			},
			package: this.hotelPackageTransformation(hotelPackage),
			request: {
				search: searchInResponse,
				package: this.hotelPackageTransformation(hotelPackageForSearch),
			},
		};
		if (check_in_instructions) {
			output.checkInInstructions = check_in_instructions;
		}
		if (hotel_fees) {
			output.hotelFees = hotel_fees;
		}

		return output;
	}

	async postPreBook(input: PostPreBookInput): Promise<PostPreBookOutput> {
		const {
			bookingPolicyId,
			clientReference,
			roomLeadGuests,
			contactPerson: {
				salutation: contactPersonSalutation,
				firstName: contactPersonFirstName,
				lastName: contactPersonLastName,
				email: contactPersonEmail,
				city: contactPersonCity,
				state: contactPersonState,
				street: contactPersonStreet,
				postalCode: contactPersonPostalCode,
				country: contactPersonCountry,
				nationality: contactPersonNationality,
				contactNo: contactPersonNo,
			},
			sessionId,
		} = input;

		const requestBody: PostPreBookBody = {
			booking_policy_id: bookingPolicyId,
			client_reference: clientReference,
			room_lead_guests: roomLeadGuests.map(
				({ salutation, firstName, lastName, nationality, remarks }) => ({
					salutation,
					first_name: firstName,
					last_name: lastName,
					nationality: nationality.join(','),
					remarks,
				})
			),
			contact_person: {
				salutation: contactPersonSalutation,
				first_name: contactPersonFirstName,
				last_name: contactPersonLastName,
				contact_no: contactPersonNo,
				email: contactPersonEmail,
				city: contactPersonCity,
				state: contactPersonState,
				street: contactPersonStreet,
				postal_code: contactPersonPostalCode,
				country: contactPersonCountry,
				nationality: (contactPersonNationality || []).join(','),
			},
		};

		const response = await this.request(
			{
				url: '/pre_book',
				method: 'POST',
				requestBody,
				requestHeaders: {
					sessionId,
				},
			},
			ApiCategory.BOOKING
		);

		return this.bookingRecordTransformation(response);
	}

	async postBook(input: PostBookInput): Promise<PostBookOutput> {
		const { encryptedCard, bookingId, sessionId } = input;

		const requestBody: PostBookBody = {};
		if (encryptedCard) {
			requestBody.encrypted_card = {
				token: encryptedCard.token,
				tokenize_provider: encryptedCard.tokenizeProvider,
				card_type: encryptedCard.cardType,
			};
		}

		const response = await this.request(
			{
				url: `/book/${bookingId}`,
				method: 'POST',
				requestBody:
					Object.keys(requestBody).length <= 0 ? undefined : requestBody,
				requestHeaders: {
					sessionId,
				},
			},
			ApiCategory.BOOKING
		);

		return this.bookingRecordTransformation(response);
	}

	async getBookStatus(input: GetBookStatusInput): Promise<GetBookStatusOutput> {
		const { bookingId, sessionId } = input;

		const response = await this.request(
			{
				url: `/book/${bookingId}/status`,
				method: 'GET',
				requestHeaders: {
					sessionId,
				},
			},
			ApiCategory.BOOKING
		);
		return this.bookingRecordTransformation(response);
	}

	async postCancel(input: PostCancelInput): Promise<PostCancelOutput> {
		const { bookingId, sessionId } = input;

		const requestBody: PostCancelBody = {
			booking_id: bookingId,
		};

		const response = await this.request(
			{
				url: '/cancel',
				method: 'POST',
				requestBody,
				requestHeaders: {
					sessionId,
				},
			},
			ApiCategory.BOOKING
		);
		return this.bookingRecordTransformation(response);
	}

	// need testing card info
	async postPaymentGuarantee(
		input: PostPaymentGuaranteeInput
	): Promise<PostPaymentGuaranteeOutput> {
		const {
			bookingId,
			cardInfo: {
				cardNo: card_no,
				cardType: card_type,
				name,
				expMM: exp_mm,
				expYY: exp_yy,
				cvc,
			},
			sessionId,
		} = input;

		const requestBody: PostPaymentGuaranteeBody = {
			booking_id: bookingId,
			card_info: {
				card_no,
				card_type,
				name,
				exp_mm,
				exp_yy,
				cvc,
			},
		};

		const { booking_id, guarantee_id } = await this.request(
			{
				url: '/',
				method: 'POST',
				requestBody,
				requestHeaders: {
					sessionId,
				},
			},
			ApiCategory.GUARANTEE
		);

		return {
			bookingId: booking_id,
			guaranteeId: guarantee_id,
		};
	}
}
