interface Country {
  code: string;
  name: string;
  currency: string;
  currencyCode: string;
  states: State[];
}

interface State {
  code: string;
  name: string;
  countryCode: string;
  cities: City[];
}

interface City {
  name: string;
  stateCode: string;
  countryCode: string;
}

export class LocationsService {
  private countriesData: Country[] = [
    {
      code: "US",
      name: "United States",
      currency: "US Dollar",
      currencyCode: "USD",
      states: [
        {
          code: "AL",
          name: "Alabama",
          countryCode: "US",
          cities: [
            { name: "Birmingham", stateCode: "AL", countryCode: "US" },
            { name: "Montgomery", stateCode: "AL", countryCode: "US" },
            { name: "Huntsville", stateCode: "AL", countryCode: "US" },
            { name: "Mobile", stateCode: "AL", countryCode: "US" },
            { name: "Tuscaloosa", stateCode: "AL", countryCode: "US" },
          ],
        },
        {
          code: "AK",
          name: "Alaska",
          countryCode: "US",
          cities: [
            { name: "Anchorage", stateCode: "AK", countryCode: "US" },
            { name: "Fairbanks", stateCode: "AK", countryCode: "US" },
            { name: "Juneau", stateCode: "AK", countryCode: "US" },
            { name: "Sitka", stateCode: "AK", countryCode: "US" },
            { name: "Ketchikan", stateCode: "AK", countryCode: "US" },
          ],
        },
        {
          code: "AZ",
          name: "Arizona",
          countryCode: "US",
          cities: [
            { name: "Phoenix", stateCode: "AZ", countryCode: "US" },
            { name: "Tucson", stateCode: "AZ", countryCode: "US" },
            { name: "Mesa", stateCode: "AZ", countryCode: "US" },
            { name: "Scottsdale", stateCode: "AZ", countryCode: "US" },
            { name: "Glendale", stateCode: "AZ", countryCode: "US" },
          ],
        },
        {
          code: "CA",
          name: "California",
          countryCode: "US",
          cities: [
            { name: "Los Angeles", stateCode: "CA", countryCode: "US" },
            { name: "San Francisco", stateCode: "CA", countryCode: "US" },
            { name: "San Diego", stateCode: "CA", countryCode: "US" },
            { name: "Sacramento", stateCode: "CA", countryCode: "US" },
            { name: "San Jose", stateCode: "CA", countryCode: "US" },
          ],
        },
        {
          code: "CO",
          name: "Colorado",
          countryCode: "US",
          cities: [
            { name: "Denver", stateCode: "CO", countryCode: "US" },
            { name: "Colorado Springs", stateCode: "CO", countryCode: "US" },
            { name: "Aurora", stateCode: "CO", countryCode: "US" },
            { name: "Fort Collins", stateCode: "CO", countryCode: "US" },
            { name: "Boulder", stateCode: "CO", countryCode: "US" },
          ],
        },
        {
          code: "FL",
          name: "Florida",
          countryCode: "US",
          cities: [
            { name: "Miami", stateCode: "FL", countryCode: "US" },
            { name: "Orlando", stateCode: "FL", countryCode: "US" },
            { name: "Tampa", stateCode: "FL", countryCode: "US" },
            { name: "Jacksonville", stateCode: "FL", countryCode: "US" },
            { name: "Fort Lauderdale", stateCode: "FL", countryCode: "US" },
          ],
        },
        {
          code: "GA",
          name: "Georgia",
          countryCode: "US",
          cities: [
            { name: "Atlanta", stateCode: "GA", countryCode: "US" },
            { name: "Savannah", stateCode: "GA", countryCode: "US" },
            { name: "Athens", stateCode: "GA", countryCode: "US" },
            { name: "Augusta", stateCode: "GA", countryCode: "US" },
            { name: "Columbus", stateCode: "GA", countryCode: "US" },
          ],
        },
        {
          code: "IL",
          name: "Illinois",
          countryCode: "US",
          cities: [
            { name: "Chicago", stateCode: "IL", countryCode: "US" },
            { name: "Springfield", stateCode: "IL", countryCode: "US" },
            { name: "Peoria", stateCode: "IL", countryCode: "US" },
            { name: "Rockford", stateCode: "IL", countryCode: "US" },
            { name: "Naperville", stateCode: "IL", countryCode: "US" },
          ],
        },
        {
          code: "NY",
          name: "New York",
          countryCode: "US",
          cities: [
            { name: "New York City", stateCode: "NY", countryCode: "US" },
            { name: "Buffalo", stateCode: "NY", countryCode: "US" },
            { name: "Rochester", stateCode: "NY", countryCode: "US" },
            { name: "Albany", stateCode: "NY", countryCode: "US" },
            { name: "Syracuse", stateCode: "NY", countryCode: "US" },
          ],
        },
        {
          code: "TX",
          name: "Texas",
          countryCode: "US",
          cities: [
            { name: "Houston", stateCode: "TX", countryCode: "US" },
            { name: "Dallas", stateCode: "TX", countryCode: "US" },
            { name: "Austin", stateCode: "TX", countryCode: "US" },
            { name: "San Antonio", stateCode: "TX", countryCode: "US" },
            { name: "Fort Worth", stateCode: "TX", countryCode: "US" },
          ],
        },
        {
          code: "AR",
          name: "Arkansas",
          countryCode: "US",
          cities: [
            { name: "Little Rock", stateCode: "AR", countryCode: "US" },
            { name: "Fort Smith", stateCode: "AR", countryCode: "US" },
            { name: "Fayetteville", stateCode: "AR", countryCode: "US" },
            { name: "Springdale", stateCode: "AR", countryCode: "US" },
            { name: "Jonesboro", stateCode: "AR", countryCode: "US" },
          ],
        },
        {
          code: "CT",
          name: "Connecticut",
          countryCode: "US",
          cities: [
            { name: "Bridgeport", stateCode: "CT", countryCode: "US" },
            { name: "New Haven", stateCode: "CT", countryCode: "US" },
            { name: "Stamford", stateCode: "CT", countryCode: "US" },
            { name: "Hartford", stateCode: "CT", countryCode: "US" },
            { name: "Waterbury", stateCode: "CT", countryCode: "US" },
          ],
        },
        {
          code: "DE",
          name: "Delaware",
          countryCode: "US",
          cities: [
            { name: "Wilmington", stateCode: "DE", countryCode: "US" },
            { name: "Dover", stateCode: "DE", countryCode: "US" },
            { name: "Newark", stateCode: "DE", countryCode: "US" },
            { name: "Middletown", stateCode: "DE", countryCode: "US" },
            { name: "Smyrna", stateCode: "DE", countryCode: "US" },
          ],
        },
        {
          code: "HI",
          name: "Hawaii",
          countryCode: "US",
          cities: [
            { name: "Honolulu", stateCode: "HI", countryCode: "US" },
            { name: "Hilo", stateCode: "HI", countryCode: "US" },
            { name: "Kailua", stateCode: "HI", countryCode: "US" },
            { name: "Kapolei", stateCode: "HI", countryCode: "US" },
            { name: "Kaneohe", stateCode: "HI", countryCode: "US" },
          ],
        },
        {
          code: "ID",
          name: "Idaho",
          countryCode: "US",
          cities: [
            { name: "Boise", stateCode: "ID", countryCode: "US" },
            { name: "Meridian", stateCode: "ID", countryCode: "US" },
            { name: "Nampa", stateCode: "ID", countryCode: "US" },
            { name: "Idaho Falls", stateCode: "ID", countryCode: "US" },
            { name: "Pocatello", stateCode: "ID", countryCode: "US" },
          ],
        },
        {
          code: "IN",
          name: "Indiana",
          countryCode: "US",
          cities: [
            { name: "Indianapolis", stateCode: "IN", countryCode: "US" },
            { name: "Fort Wayne", stateCode: "IN", countryCode: "US" },
            { name: "Evansville", stateCode: "IN", countryCode: "US" },
            { name: "South Bend", stateCode: "IN", countryCode: "US" },
            { name: "Carmel", stateCode: "IN", countryCode: "US" },
          ],
        },
        {
          code: "IA",
          name: "Iowa",
          countryCode: "US",
          cities: [
            { name: "Des Moines", stateCode: "IA", countryCode: "US" },
            { name: "Cedar Rapids", stateCode: "IA", countryCode: "US" },
            { name: "Davenport", stateCode: "IA", countryCode: "US" },
            { name: "Sioux City", stateCode: "IA", countryCode: "US" },
            { name: "Iowa City", stateCode: "IA", countryCode: "US" },
          ],
        },
        {
          code: "KS",
          name: "Kansas",
          countryCode: "US",
          cities: [
            { name: "Wichita", stateCode: "KS", countryCode: "US" },
            { name: "Overland Park", stateCode: "KS", countryCode: "US" },
            { name: "Kansas City", stateCode: "KS", countryCode: "US" },
            { name: "Olathe", stateCode: "KS", countryCode: "US" },
            { name: "Topeka", stateCode: "KS", countryCode: "US" },
          ],
        },
        {
          code: "KY",
          name: "Kentucky",
          countryCode: "US",
          cities: [
            { name: "Louisville", stateCode: "KY", countryCode: "US" },
            { name: "Lexington", stateCode: "KY", countryCode: "US" },
            { name: "Bowling Green", stateCode: "KY", countryCode: "US" },
            { name: "Owensboro", stateCode: "KY", countryCode: "US" },
            { name: "Covington", stateCode: "KY", countryCode: "US" },
          ],
        },
        {
          code: "LA",
          name: "Louisiana",
          countryCode: "US",
          cities: [
            { name: "New Orleans", stateCode: "LA", countryCode: "US" },
            { name: "Baton Rouge", stateCode: "LA", countryCode: "US" },
            { name: "Shreveport", stateCode: "LA", countryCode: "US" },
            { name: "Lafayette", stateCode: "LA", countryCode: "US" },
            { name: "Lake Charles", stateCode: "LA", countryCode: "US" },
          ],
        },
        {
          code: "ME",
          name: "Maine",
          countryCode: "US",
          cities: [
            { name: "Portland", stateCode: "ME", countryCode: "US" },
            { name: "Lewiston", stateCode: "ME", countryCode: "US" },
            { name: "Bangor", stateCode: "ME", countryCode: "US" },
            { name: "Auburn", stateCode: "ME", countryCode: "US" },
            { name: "Biddeford", stateCode: "ME", countryCode: "US" },
          ],
        },
        {
          code: "MD",
          name: "Maryland",
          countryCode: "US",
          cities: [
            { name: "Baltimore", stateCode: "MD", countryCode: "US" },
            { name: "Frederick", stateCode: "MD", countryCode: "US" },
            { name: "Rockville", stateCode: "MD", countryCode: "US" },
            { name: "Gaithersburg", stateCode: "MD", countryCode: "US" },
            { name: "Bowie", stateCode: "MD", countryCode: "US" },
          ],
        },
        {
          code: "MA",
          name: "Massachusetts",
          countryCode: "US",
          cities: [
            { name: "Boston", stateCode: "MA", countryCode: "US" },
            { name: "Worcester", stateCode: "MA", countryCode: "US" },
            { name: "Springfield", stateCode: "MA", countryCode: "US" },
            { name: "Cambridge", stateCode: "MA", countryCode: "US" },
            { name: "Lowell", stateCode: "MA", countryCode: "US" },
          ],
        },
        {
          code: "MI",
          name: "Michigan",
          countryCode: "US",
          cities: [
            { name: "Detroit", stateCode: "MI", countryCode: "US" },
            { name: "Grand Rapids", stateCode: "MI", countryCode: "US" },
            { name: "Warren", stateCode: "MI", countryCode: "US" },
            { name: "Sterling Heights", stateCode: "MI", countryCode: "US" },
            { name: "Lansing", stateCode: "MI", countryCode: "US" },
          ],
        },
        {
          code: "MN",
          name: "Minnesota",
          countryCode: "US",
          cities: [
            { name: "Minneapolis", stateCode: "MN", countryCode: "US" },
            { name: "Saint Paul", stateCode: "MN", countryCode: "US" },
            { name: "Rochester", stateCode: "MN", countryCode: "US" },
            { name: "Duluth", stateCode: "MN", countryCode: "US" },
            { name: "Bloomington", stateCode: "MN", countryCode: "US" },
          ],
        },
        {
          code: "MS",
          name: "Mississippi",
          countryCode: "US",
          cities: [
            { name: "Jackson", stateCode: "MS", countryCode: "US" },
            { name: "Gulfport", stateCode: "MS", countryCode: "US" },
            { name: "Southaven", stateCode: "MS", countryCode: "US" },
            { name: "Hattiesburg", stateCode: "MS", countryCode: "US" },
            { name: "Biloxi", stateCode: "MS", countryCode: "US" },
          ],
        },
        {
          code: "MO",
          name: "Missouri",
          countryCode: "US",
          cities: [
            { name: "Kansas City", stateCode: "MO", countryCode: "US" },
            { name: "St. Louis", stateCode: "MO", countryCode: "US" },
            { name: "Springfield", stateCode: "MO", countryCode: "US" },
            { name: "Columbia", stateCode: "MO", countryCode: "US" },
            { name: "Independence", stateCode: "MO", countryCode: "US" },
          ],
        },
        {
          code: "MT",
          name: "Montana",
          countryCode: "US",
          cities: [
            { name: "Billings", stateCode: "MT", countryCode: "US" },
            { name: "Missoula", stateCode: "MT", countryCode: "US" },
            { name: "Great Falls", stateCode: "MT", countryCode: "US" },
            { name: "Bozeman", stateCode: "MT", countryCode: "US" },
            { name: "Butte", stateCode: "MT", countryCode: "US" },
          ],
        },
        {
          code: "NE",
          name: "Nebraska",
          countryCode: "US",
          cities: [
            { name: "Omaha", stateCode: "NE", countryCode: "US" },
            { name: "Lincoln", stateCode: "NE", countryCode: "US" },
            { name: "Bellevue", stateCode: "NE", countryCode: "US" },
            { name: "Grand Island", stateCode: "NE", countryCode: "US" },
            { name: "Kearney", stateCode: "NE", countryCode: "US" },
          ],
        },
        {
          code: "NV",
          name: "Nevada",
          countryCode: "US",
          cities: [
            { name: "Las Vegas", stateCode: "NV", countryCode: "US" },
            { name: "Henderson", stateCode: "NV", countryCode: "US" },
            { name: "Reno", stateCode: "NV", countryCode: "US" },
            { name: "North Las Vegas", stateCode: "NV", countryCode: "US" },
            { name: "Sparks", stateCode: "NV", countryCode: "US" },
          ],
        },
        {
          code: "NH",
          name: "New Hampshire",
          countryCode: "US",
          cities: [
            { name: "Manchester", stateCode: "NH", countryCode: "US" },
            { name: "Nashua", stateCode: "NH", countryCode: "US" },
            { name: "Concord", stateCode: "NH", countryCode: "US" },
            { name: "Dover", stateCode: "NH", countryCode: "US" },
            { name: "Rochester", stateCode: "NH", countryCode: "US" },
          ],
        },
        {
          code: "NJ",
          name: "New Jersey",
          countryCode: "US",
          cities: [
            { name: "Newark", stateCode: "NJ", countryCode: "US" },
            { name: "Jersey City", stateCode: "NJ", countryCode: "US" },
            { name: "Paterson", stateCode: "NJ", countryCode: "US" },
            { name: "Elizabeth", stateCode: "NJ", countryCode: "US" },
            { name: "Trenton", stateCode: "NJ", countryCode: "US" },
          ],
        },
        {
          code: "NM",
          name: "New Mexico",
          countryCode: "US",
          cities: [
            { name: "Albuquerque", stateCode: "NM", countryCode: "US" },
            { name: "Las Cruces", stateCode: "NM", countryCode: "US" },
            { name: "Santa Fe", stateCode: "NM", countryCode: "US" },
            { name: "Rio Rancho", stateCode: "NM", countryCode: "US" },
            { name: "Roswell", stateCode: "NM", countryCode: "US" },
          ],
        },
        {
          code: "NC",
          name: "North Carolina",
          countryCode: "US",
          cities: [
            { name: "Charlotte", stateCode: "NC", countryCode: "US" },
            { name: "Raleigh", stateCode: "NC", countryCode: "US" },
            { name: "Greensboro", stateCode: "NC", countryCode: "US" },
            { name: "Durham", stateCode: "NC", countryCode: "US" },
            { name: "Winston-Salem", stateCode: "NC", countryCode: "US" },
          ],
        },
        {
          code: "ND",
          name: "North Dakota",
          countryCode: "US",
          cities: [
            { name: "Fargo", stateCode: "ND", countryCode: "US" },
            { name: "Bismarck", stateCode: "ND", countryCode: "US" },
            { name: "Grand Forks", stateCode: "ND", countryCode: "US" },
            { name: "Minot", stateCode: "ND", countryCode: "US" },
            { name: "West Fargo", stateCode: "ND", countryCode: "US" },
          ],
        },
        {
          code: "OH",
          name: "Ohio",
          countryCode: "US",
          cities: [
            { name: "Columbus", stateCode: "OH", countryCode: "US" },
            { name: "Cleveland", stateCode: "OH", countryCode: "US" },
            { name: "Cincinnati", stateCode: "OH", countryCode: "US" },
            { name: "Toledo", stateCode: "OH", countryCode: "US" },
            { name: "Akron", stateCode: "OH", countryCode: "US" },
          ],
        },
        {
          code: "OK",
          name: "Oklahoma",
          countryCode: "US",
          cities: [
            { name: "Oklahoma City", stateCode: "OK", countryCode: "US" },
            { name: "Tulsa", stateCode: "OK", countryCode: "US" },
            { name: "Norman", stateCode: "OK", countryCode: "US" },
            { name: "Broken Arrow", stateCode: "OK", countryCode: "US" },
            { name: "Lawton", stateCode: "OK", countryCode: "US" },
          ],
        },
        {
          code: "OR",
          name: "Oregon",
          countryCode: "US",
          cities: [
            { name: "Portland", stateCode: "OR", countryCode: "US" },
            { name: "Salem", stateCode: "OR", countryCode: "US" },
            { name: "Eugene", stateCode: "OR", countryCode: "US" },
            { name: "Gresham", stateCode: "OR", countryCode: "US" },
            { name: "Hillsboro", stateCode: "OR", countryCode: "US" },
          ],
        },
        {
          code: "PA",
          name: "Pennsylvania",
          countryCode: "US",
          cities: [
            { name: "Philadelphia", stateCode: "PA", countryCode: "US" },
            { name: "Pittsburgh", stateCode: "PA", countryCode: "US" },
            { name: "Allentown", stateCode: "PA", countryCode: "US" },
            { name: "Erie", stateCode: "PA", countryCode: "US" },
            { name: "Reading", stateCode: "PA", countryCode: "US" },
          ],
        },
        {
          code: "RI",
          name: "Rhode Island",
          countryCode: "US",
          cities: [
            { name: "Providence", stateCode: "RI", countryCode: "US" },
            { name: "Warwick", stateCode: "RI", countryCode: "US" },
            { name: "Cranston", stateCode: "RI", countryCode: "US" },
            { name: "Pawtucket", stateCode: "RI", countryCode: "US" },
            { name: "East Providence", stateCode: "RI", countryCode: "US" },
          ],
        },
        {
          code: "SC",
          name: "South Carolina",
          countryCode: "US",
          cities: [
            { name: "Columbia", stateCode: "SC", countryCode: "US" },
            { name: "Charleston", stateCode: "SC", countryCode: "US" },
            { name: "North Charleston", stateCode: "SC", countryCode: "US" },
            { name: "Mount Pleasant", stateCode: "SC", countryCode: "US" },
            { name: "Rock Hill", stateCode: "SC", countryCode: "US" },
          ],
        },
        {
          code: "SD",
          name: "South Dakota",
          countryCode: "US",
          cities: [
            { name: "Sioux Falls", stateCode: "SD", countryCode: "US" },
            { name: "Rapid City", stateCode: "SD", countryCode: "US" },
            { name: "Aberdeen", stateCode: "SD", countryCode: "US" },
            { name: "Brookings", stateCode: "SD", countryCode: "US" },
            { name: "Watertown", stateCode: "SD", countryCode: "US" },
          ],
        },
        {
          code: "TN",
          name: "Tennessee",
          countryCode: "US",
          cities: [
            { name: "Nashville", stateCode: "TN", countryCode: "US" },
            { name: "Memphis", stateCode: "TN", countryCode: "US" },
            { name: "Knoxville", stateCode: "TN", countryCode: "US" },
            { name: "Chattanooga", stateCode: "TN", countryCode: "US" },
            { name: "Clarksville", stateCode: "TN", countryCode: "US" },
          ],
        },
        {
          code: "UT",
          name: "Utah",
          countryCode: "US",
          cities: [
            { name: "Salt Lake City", stateCode: "UT", countryCode: "US" },
            { name: "West Valley City", stateCode: "UT", countryCode: "US" },
            { name: "Provo", stateCode: "UT", countryCode: "US" },
            { name: "West Jordan", stateCode: "UT", countryCode: "US" },
            { name: "Orem", stateCode: "UT", countryCode: "US" },
          ],
        },
        {
          code: "VT",
          name: "Vermont",
          countryCode: "US",
          cities: [
            { name: "Burlington", stateCode: "VT", countryCode: "US" },
            { name: "South Burlington", stateCode: "VT", countryCode: "US" },
            { name: "Rutland", stateCode: "VT", countryCode: "US" },
            { name: "Montpelier", stateCode: "VT", countryCode: "US" },
            { name: "Barre", stateCode: "VT", countryCode: "US" },
          ],
        },
        {
          code: "VA",
          name: "Virginia",
          countryCode: "US",
          cities: [
            { name: "Virginia Beach", stateCode: "VA", countryCode: "US" },
            { name: "Richmond", stateCode: "VA", countryCode: "US" },
            { name: "Arlington", stateCode: "VA", countryCode: "US" },
            { name: "Norfolk", stateCode: "VA", countryCode: "US" },
            { name: "Alexandria", stateCode: "VA", countryCode: "US" },
          ],
        },
        {
          code: "WA",
          name: "Washington",
          countryCode: "US",
          cities: [
            { name: "Seattle", stateCode: "WA", countryCode: "US" },
            { name: "Spokane", stateCode: "WA", countryCode: "US" },
            { name: "Tacoma", stateCode: "WA", countryCode: "US" },
            { name: "Vancouver", stateCode: "WA", countryCode: "US" },
            { name: "Bellevue", stateCode: "WA", countryCode: "US" },
          ],
        },
        {
          code: "WV",
          name: "West Virginia",
          countryCode: "US",
          cities: [
            { name: "Charleston", stateCode: "WV", countryCode: "US" },
            { name: "Huntington", stateCode: "WV", countryCode: "US" },
            { name: "Morgantown", stateCode: "WV", countryCode: "US" },
            { name: "Parkersburg", stateCode: "WV", countryCode: "US" },
            { name: "Wheeling", stateCode: "WV", countryCode: "US" },
          ],
        },
        {
          code: "WI",
          name: "Wisconsin",
          countryCode: "US",
          cities: [
            { name: "Milwaukee", stateCode: "WI", countryCode: "US" },
            { name: "Madison", stateCode: "WI", countryCode: "US" },
            { name: "Green Bay", stateCode: "WI", countryCode: "US" },
            { name: "Kenosha", stateCode: "WI", countryCode: "US" },
            { name: "Racine", stateCode: "WI", countryCode: "US" },
          ],
        },
        {
          code: "WY",
          name: "Wyoming",
          countryCode: "US",
          cities: [
            { name: "Cheyenne", stateCode: "WY", countryCode: "US" },
            { name: "Casper", stateCode: "WY", countryCode: "US" },
            { name: "Laramie", stateCode: "WY", countryCode: "US" },
            { name: "Gillette", stateCode: "WY", countryCode: "US" },
            { name: "Rock Springs", stateCode: "WY", countryCode: "US" },
          ],
        },
      ],
    },
    {
      code: "CA",
      name: "Canada",
      currency: "Canadian Dollar",
      currencyCode: "CAD",
      states: [
        {
          code: "AB",
          name: "Alberta",
          countryCode: "CA",
          cities: [
            { name: "Calgary", stateCode: "AB", countryCode: "CA" },
            { name: "Edmonton", stateCode: "AB", countryCode: "CA" },
            { name: "Red Deer", stateCode: "AB", countryCode: "CA" },
            { name: "Lethbridge", stateCode: "AB", countryCode: "CA" },
            { name: "Medicine Hat", stateCode: "AB", countryCode: "CA" },
          ],
        },
        {
          code: "BC",
          name: "British Columbia",
          countryCode: "CA",
          cities: [
            { name: "Vancouver", stateCode: "BC", countryCode: "CA" },
            { name: "Victoria", stateCode: "BC", countryCode: "CA" },
            { name: "Surrey", stateCode: "BC", countryCode: "CA" },
            { name: "Burnaby", stateCode: "BC", countryCode: "CA" },
            { name: "Richmond", stateCode: "BC", countryCode: "CA" },
          ],
        },
        {
          code: "MB",
          name: "Manitoba",
          countryCode: "CA",
          cities: [
            { name: "Winnipeg", stateCode: "MB", countryCode: "CA" },
            { name: "Brandon", stateCode: "MB", countryCode: "CA" },
            { name: "Steinbach", stateCode: "MB", countryCode: "CA" },
            { name: "Thompson", stateCode: "MB", countryCode: "CA" },
            { name: "Portage la Prairie", stateCode: "MB", countryCode: "CA" },
          ],
        },
        {
          code: "NB",
          name: "New Brunswick",
          countryCode: "CA",
          cities: [
            { name: "Saint John", stateCode: "NB", countryCode: "CA" },
            { name: "Moncton", stateCode: "NB", countryCode: "CA" },
            { name: "Fredericton", stateCode: "NB", countryCode: "CA" },
            { name: "Dieppe", stateCode: "NB", countryCode: "CA" },
            { name: "Miramichi", stateCode: "NB", countryCode: "CA" },
          ],
        },
        {
          code: "NL",
          name: "Newfoundland and Labrador",
          countryCode: "CA",
          cities: [
            { name: "St. John's", stateCode: "NL", countryCode: "CA" },
            { name: "Mount Pearl", stateCode: "NL", countryCode: "CA" },
            { name: "Corner Brook", stateCode: "NL", countryCode: "CA" },
            { name: "Grand Falls-Windsor", stateCode: "NL", countryCode: "CA" },
            { name: "Gander", stateCode: "NL", countryCode: "CA" },
          ],
        },
        {
          code: "NS",
          name: "Nova Scotia",
          countryCode: "CA",
          cities: [
            { name: "Halifax", stateCode: "NS", countryCode: "CA" },
            { name: "Sydney", stateCode: "NS", countryCode: "CA" },
            { name: "Dartmouth", stateCode: "NS", countryCode: "CA" },
            { name: "Truro", stateCode: "NS", countryCode: "CA" },
            { name: "New Glasgow", stateCode: "NS", countryCode: "CA" },
          ],
        },
        {
          code: "ON",
          name: "Ontario",
          countryCode: "CA",
          cities: [
            { name: "Toronto", stateCode: "ON", countryCode: "CA" },
            { name: "Ottawa", stateCode: "ON", countryCode: "CA" },
            { name: "Mississauga", stateCode: "ON", countryCode: "CA" },
            { name: "Brampton", stateCode: "ON", countryCode: "CA" },
            { name: "Hamilton", stateCode: "ON", countryCode: "CA" },
          ],
        },
        {
          code: "PE",
          name: "Prince Edward Island",
          countryCode: "CA",
          cities: [
            { name: "Charlottetown", stateCode: "PE", countryCode: "CA" },
            { name: "Summerside", stateCode: "PE", countryCode: "CA" },
            { name: "Stratford", stateCode: "PE", countryCode: "CA" },
            { name: "Cornwall", stateCode: "PE", countryCode: "CA" },
            { name: "Montague", stateCode: "PE", countryCode: "CA" },
          ],
        },
        {
          code: "QC",
          name: "Quebec",
          countryCode: "CA",
          cities: [
            { name: "Montreal", stateCode: "QC", countryCode: "CA" },
            { name: "Quebec City", stateCode: "QC", countryCode: "CA" },
            { name: "Laval", stateCode: "QC", countryCode: "CA" },
            { name: "Gatineau", stateCode: "QC", countryCode: "CA" },
            { name: "Longueuil", stateCode: "QC", countryCode: "CA" },
          ],
        },
        {
          code: "SK",
          name: "Saskatchewan",
          countryCode: "CA",
          cities: [
            { name: "Saskatoon", stateCode: "SK", countryCode: "CA" },
            { name: "Regina", stateCode: "SK", countryCode: "CA" },
            { name: "Prince Albert", stateCode: "SK", countryCode: "CA" },
            { name: "Moose Jaw", stateCode: "SK", countryCode: "CA" },
            { name: "Swift Current", stateCode: "SK", countryCode: "CA" },
          ],
        },
        {
          code: "NT",
          name: "Northwest Territories",
          countryCode: "CA",
          cities: [
            { name: "Yellowknife", stateCode: "NT", countryCode: "CA" },
            { name: "Hay River", stateCode: "NT", countryCode: "CA" },
            { name: "Inuvik", stateCode: "NT", countryCode: "CA" },
            { name: "Fort Smith", stateCode: "NT", countryCode: "CA" },
            { name: "Norman Wells", stateCode: "NT", countryCode: "CA" },
          ],
        },
        {
          code: "NU",
          name: "Nunavut",
          countryCode: "CA",
          cities: [
            { name: "Iqaluit", stateCode: "NU", countryCode: "CA" },
            { name: "Rankin Inlet", stateCode: "NU", countryCode: "CA" },
            { name: "Arviat", stateCode: "NU", countryCode: "CA" },
            { name: "Baker Lake", stateCode: "NU", countryCode: "CA" },
            { name: "Cambridge Bay", stateCode: "NU", countryCode: "CA" },
          ],
        },
        {
          code: "YT",
          name: "Yukon",
          countryCode: "CA",
          cities: [
            { name: "Whitehorse", stateCode: "YT", countryCode: "CA" },
            { name: "Dawson City", stateCode: "YT", countryCode: "CA" },
            { name: "Watson Lake", stateCode: "YT", countryCode: "CA" },
            { name: "Haines Junction", stateCode: "YT", countryCode: "CA" },
            { name: "Carmacks", stateCode: "YT", countryCode: "CA" },
          ],
        },
      ],
    },
  ];

  async getCountries(): Promise<Omit<Country, "states">[]> {
    return this.countriesData.map((country) => ({
      code: country.code,
      name: country.name,
      currency: country.currency,
      currencyCode: country.currencyCode,
    }));
  }

  async getStatesByCountry(
    countryCode: string
  ): Promise<Omit<State, "cities">[]> {
    const country = this.countriesData.find((c) => c.code === countryCode);
    if (!country) {
      throw new Error(`Country with code ${countryCode} not found`);
    }

    return country.states.map((state) => ({
      code: state.code,
      name: state.name,
      countryCode: state.countryCode,
    }));
  }

  async getCitiesByState(
    countryCode: string,
    stateCode: string
  ): Promise<City[]> {
    const country = this.countriesData.find((c) => c.code === countryCode);
    if (!country) {
      throw new Error(`Country with code ${countryCode} not found`);
    }

    const state = country.states.find((s) => s.code === stateCode);
    if (!state) {
      throw new Error(
        `State with code ${stateCode} not found in country ${countryCode}`
      );
    }

    return state.cities;
  }

  async getAllStates(): Promise<Omit<State, "cities">[]> {
    const allStates: Omit<State, "cities">[] = [];
    this.countriesData.forEach((country) => {
      country.states.forEach((state) => {
        allStates.push({
          code: state.code,
          name: state.name,
          countryCode: state.countryCode,
        });
      });
    });
    return allStates;
  }

  async getAllCities(): Promise<City[]> {
    const allCities: City[] = [];
    this.countriesData.forEach((country) => {
      country.states.forEach((state) => {
        allCities.push(...state.cities);
      });
    });
    return allCities;
  }
}
