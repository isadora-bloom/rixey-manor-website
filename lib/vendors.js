// Vendor recommendations data — extracted from Rixey Manor's curated Excel file
// Categories cleaned up from the original "Catering" column header (which was actually Category)

export const VENDORS = [
  // Alcohol
  { category: 'Alcohol', name: 'Total Wine and Beer', notes: '', contact: '', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Alcohol', name: 'Vinosity', notes: 'Local, helpful, wine and beer. Will deliver.', contact: 'Kim', website: 'https://www.vinositywines.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Babysitters
  { category: 'Babysitters', name: 'Christina Sisk', notes: '', contact: '', website: '1(571)2795113', multipleEvents: false, local: true, budgetFriendly: false, indian: false, chinese: false },

  // Band
  { category: 'Band', name: 'Atoka Strings', notes: '3 or 4 people', contact: '', website: 'https://www.atokastringquartet.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Band', name: 'Bachelor Boys', notes: '3 - 14 people', contact: '', website: 'https://www.bachelorboysband.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Brunch
  { category: 'Brunch', name: 'Carpe Donuts', notes: 'Donuts, omelets, coffee etc', contact: '', website: 'https://carpedonut.org/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Brunch', name: 'Panera', notes: 'Delivers', contact: '', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Catering
  { category: 'Catering', name: 'Indorama', notes: 'Best Indian/Fusion Food around', contact: '', website: 'https://indaroma.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },
  { category: 'Catering', name: 'Genesis Delight', notes: 'Good Value, Classic Catering', contact: '', website: 'https://www.genesisdelightcateringdmv.com/', multipleEvents: false, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Catering', name: 'Black Garlic', notes: 'Custom, high end', contact: 'Merril', website: 'https://www.blackgarlicevents.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Catering', name: 'Classic Catering', notes: 'Good Classic Wedding Food', contact: 'Norma', website: 'https://classiccateringinfo.com/', multipleEvents: true, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Catering', name: 'Serendipity', notes: 'Classic Wedding Food - mid range', contact: 'Jess', website: 'https://serendipityvirginia.com/', multipleEvents: true, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Catering', name: "Court's Kitchen", notes: 'Lighter fare, works well as a supplement to food trucks or finger food dinner.', contact: 'Court', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Catering', name: 'The Catering Company', notes: 'Only worked one event but seem good value for money', contact: '', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Catering', name: 'El Habanero', notes: 'Have a food stall, make tortilla onsite, great authentic Mexican food', contact: '', website: 'https://www.elhabanerotexmexgrill.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Catering', name: 'Pampas Fox', notes: 'High End, Farm to Table, Desserts', contact: '', website: 'https://pampasfoxcatering.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Decor Rentals
  { category: 'Decor Rentals', name: 'Fox and Fern Vintage Rentals', notes: '', contact: '', website: 'https://www.foxandfernvintagerentals.com/inventory', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Decor Rentals', name: 'Local Wood Event Rentals', notes: 'Farm Tables', contact: '', website: 'https://localwoodva.com/local-wood-event-rentals', multipleEvents: false, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Decor Rentals', name: 'Something Vintage', notes: 'Rental Packages, High End', contact: '', website: 'https://www.somethingvintagerentals.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Decor Rentals', name: 'Bride and Joy', notes: 'Local rentals, calligraphy', contact: 'Jess', website: 'https://www.brideandjoyweddings.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Decorator
  { category: 'Decorator', name: 'Shagun Weddings', notes: 'Indian Wedding Decorator', contact: '', website: 'https://shagunweddings.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },
  { category: 'Decorator', name: 'Liz Decorations', notes: 'Indian Wedding Decorator', contact: '', website: 'https://www.weddingwire.com/reviews/liz-decorations-centreville/ec589b12cf2c4c59.html', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },

  // Dessert
  { category: 'Dessert', name: 'Liberty Baking Co', notes: 'Amazing piping work', contact: '', website: 'https://libertybaking.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Dessert', name: 'Nothing Bundt Cake', notes: 'A fun low key option (pick up only)', contact: '', website: 'https://www.nothingbundtcakes.com/', multipleEvents: false, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Dessert', name: 'Captain Cookie', notes: 'Ice Cream Sandwiches (very popular)', contact: '', website: 'https://captaincookiedc.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Dessert', name: 'Signature Sweets', notes: 'Huge dessert bar options', contact: 'Amanda', website: 'https://www.signaturesweetsbyamanda.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Dessert', name: 'Gateau', notes: 'Pricing on website, dairy and gluten-free options', contact: 'Lorna', website: 'https://www.gateaubakery.com/', multipleEvents: true, local: false, budgetFriendly: true, indian: false, chinese: false },

  // DJ
  { category: 'DJ', name: 'Black Tie Entertainment', notes: 'Large Company - lots of options (Eddy Bobby most seen)', contact: '', website: 'https://www.musicdj.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'DJ', name: "I'm the DJ", notes: 'Most used DJ - Nate, Craig, Steve and Ian - priced by DJ', contact: 'Nate', website: 'https://imthedj.net/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'DJ', name: 'WG Entertainment', notes: 'New DJ (only seen once) but was great', contact: 'Will', website: 'https://djwillgralley.com', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Florist
  { category: 'Florist', name: 'Drive By Flowers', notes: 'Amazing work and installations, local (married to Annex Room Videographer)', contact: '', website: 'https://www.drivebyflowers.com/', multipleEvents: false, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Florist', name: 'Samantha Greenfield', notes: 'New florist to us but did a great job and local', contact: 'Samantha', website: 'https://www.samanthagreenfield.com/', multipleEvents: false, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Florist', name: 'J Morris', notes: 'Some pricing online', contact: '', website: 'https://www.jmorrisflowers.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Florist', name: 'Good Earth Flowers', notes: 'Probably worked 75% of our weddings', contact: 'Tammy', website: 'https://www.weddingfloristculpeper.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Food Truck
  { category: 'Food Truck', name: 'Devine Swine', notes: 'BBQ', contact: '', website: 'https://www.facebook.com/delibbqkitchen/', multipleEvents: false, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Food Truck', name: 'Captain Cookie', notes: 'Ice Cream Sandwiches (very popular)', contact: '', website: 'https://captaincookiedc.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Food Truck', name: 'Carpe Donut', notes: 'Donuts, omelets, coffee etc', contact: '', website: 'https://carpedonut.org/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Food Truck', name: 'Timber Pizza', notes: 'Wood fire pizza', contact: '', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Food Truck', name: 'Melted Dreams', notes: 'Smash burgers, street tacos', contact: '', website: 'https://melteddreamsfoodco.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Food Truck', name: 'El Habanero', notes: 'Have a food stall, make tortilla onsite, great authentic Mexican food', contact: '', website: 'https://www.elhabanerotexmexgrill.com/', multipleEvents: false, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Food Truck', name: 'Blue Ridge Pizza', notes: 'Wood fire pizzas, very popular and quick to produce food', contact: '', website: 'https://www.blueridgepizza.com/', multipleEvents: true, local: false, budgetFriendly: true, indian: false, chinese: false },

  // Hair and Makeup
  { category: 'Hair & Makeup', name: 'Blushaway Bride', notes: '', contact: '', website: 'https://www.blushaway.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },
  { category: 'Hair & Makeup', name: 'Priscilla M Beauty', notes: 'Experienced Makeup Artist', contact: '', website: 'https://priscillambeauty.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Hair & Makeup', name: 'Sania Raja', notes: 'Indian Wedding Makeup', contact: '', website: 'https://www.facebook.com/SaniaYRaja/', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },
  { category: 'Hair & Makeup', name: 'Sarah Dodson', notes: 'Has worked at the Manor since day one (literally)', contact: '', website: 'https://saradodsonmakeup.com/', multipleEvents: true, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Hair & Makeup', name: 'Yiselle Santos', notes: 'Our most booked Makeup artist. Large range of styles and skin tones', contact: '', website: 'https://www.yisellsantosmakeup.com/', multipleEvents: true, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Hair & Makeup', name: 'Mane Street Hair Salon', notes: 'Experienced and local, has a salon too so great for out of town guest recommendations', contact: '', website: '', multipleEvents: true, local: true, budgetFriendly: false, indian: false, chinese: false },

  // Henna / Mendi
  { category: 'Henna / Mendi', name: "Bhavna's Henna", notes: 'Talented artist and happy to travel', contact: '', website: 'https://bhavnashenna.com/index.html', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },

  // Hotels
  { category: 'Hotels', name: 'Days Inn', notes: 'Culpeper (Older Hotel)', contact: '', website: '', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Hotels', name: 'Hampton Inn', notes: 'Culpeper (Newest hotel)', contact: '', website: '', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Hotels', name: 'Holiday Inn Express', notes: 'Culpeper (Newly refurbished)', contact: '', website: '', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Linens
  { category: 'Linens', name: "Sammy's Rentals", notes: 'Less Selection / Better Price', contact: '', website: 'http://www.sammysrental.com/', multipleEvents: true, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Linens', name: 'Select Event Rentals', notes: 'More Expensive / Better Selection', contact: '', website: 'https://selecteventgroup.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Lunch
  { category: 'Lunch', name: 'Chipotle', notes: '', contact: '', website: '', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Lunch', name: 'Panera', notes: 'Delivers', contact: '', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Lunch', name: 'Deli-icious', notes: 'Easy and good sandwiches, wraps, delivered (big favorite)', contact: '', website: 'https://deliiciousva.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Lunch', name: 'Tropical Smoothie', notes: '', contact: '', website: '', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Officiants
  { category: 'Officiant', name: 'Ed Choy', notes: 'Chinese Church, as well as all religious ceremonies. Very experienced.', contact: '', website: 'https://www.restoration.church/meet-pastor-ed', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: true },
  { category: 'Officiant', name: 'Rabbi Ilana Zietman', notes: 'Wonderful and very inclusive Rabbi', contact: '', website: 'https://gatherdc.org/team/rabbi-ilana-zietman/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Officiant', name: 'Gwendolyn Steele', notes: 'Conducts ceremonies of all types - local', contact: '', website: 'https://www.steelechick.com/officiant', multipleEvents: false, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Officiant', name: 'Weddings by Jeff', notes: 'Conducts ceremonies of all types', contact: '', website: 'https://www.weddingceremoniesbyjeff.com/', multipleEvents: false, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Officiant', name: 'Mary Sullivan', notes: 'Our most used officiant both for signing and conducting ceremonies of all types', contact: '', website: 'https://www.weddingwire.com/biz/mary-c-sullivan-warrenton/e8fff55b9a1230ba.html', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Photographer
  { category: 'Photographer', name: 'Brett Denfeld', notes: 'Classic, experience with Indian Weddings', contact: '', website: 'https://brettdenfeldphotography.com/wedding-investment', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },
  { category: 'Photographer', name: 'Melissa Barrick', notes: 'Bright and Light photography', contact: '', website: 'https://melissabarrickcreativeco.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Samanta Leto', notes: 'Natural and realistic coloring', contact: '', website: 'https://samanthaletophoto.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Second Bloom Photography', notes: 'Bright and classic', contact: '', website: 'https://secondbloomphotography.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Jackie St Clair', notes: 'Former Rixey Bride - Light, classic, soft', contact: '', website: 'https://jstclairphotos.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Rebekah Emily', notes: 'Former Rixey Bride - Light, classic, soft', contact: '', website: 'https://rebekahemily.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Steph Dee', notes: 'Classic and colorful', contact: '', website: 'https://stephdeephoto.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Michelle Lieb', notes: 'Bright, light, experience with church weddings', contact: '', website: 'https://liebphotographic.com/', multipleEvents: true, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Briarley Images', notes: 'Bold, colorful, stylistic, real colouring', contact: '', website: 'https://www.briarleyimages.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Photographer', name: 'Bonnie Turner', notes: 'Warmer colours', contact: '', website: 'https://www.bonnieturnerphoto.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Photographer', name: 'Hannah Keller Photography', notes: 'More saturated colors', contact: '', website: 'https://www.hannahkellerphoto.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Planner
  { category: 'Planner', name: 'Angelica and Co', notes: 'Indian Weddings / Fusion Weddings', contact: '', website: 'https://angelicaandco.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },
  { category: 'Planner', name: 'Magnolia Collective', notes: '', contact: '', website: 'https://www.idomagnolia.com/team/meagan-culkin', multipleEvents: false, local: false, budgetFriendly: false, indian: true, chinese: false },

  // Rehearsal Dinner (at Rixey)
  { category: 'Rehearsal Dinner', name: 'El Habanero', notes: 'Have a food stall, make tortilla onsite, great authentic Mexican food', contact: '', website: 'https://www.elhabanerotexmexgrill.com/', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Rehearsal Dinner', name: "Ellie's Place", notes: 'BBQ and other types of food', contact: '', website: 'https://elliesplaceonmain.com/index.html', multipleEvents: false, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Rehearsal Dinner', name: 'Burnt Ends', notes: 'BBQ, Smokey', contact: '', website: 'https://www.burntendsbbqllc.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Rehearsal Dinner', name: 'Chipotle', notes: '', contact: '', website: '', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Rehearsal Dinner', name: "Luigi's", notes: 'Italian', contact: '', website: 'https://luigisculpeper.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Rehearsal Dinner', name: 'Pancho Villa', notes: 'Mexican', contact: '', website: 'https://www.panchovillava.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Rehearsal Dinner', name: 'Pinto Thai', notes: 'Amazing Thai', contact: '', website: 'https://www.pintothaiculpeper.com/', multipleEvents: true, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Rehearsal Off Site
  { category: 'Rehearsal (Off-Site)', name: "It's About Thyme", notes: 'European fine dining', contact: '', website: 'https://www.thymeinfo.com/', multipleEvents: false, local: true, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Rehearsal (Off-Site)', name: 'Burnt Ends', notes: 'BBQ, Smokey', contact: '', website: 'https://www.burntendsbbqllc.com/', multipleEvents: false, local: true, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Rehearsal (Off-Site)', name: 'Piedmont Steakhouse', notes: 'Surf and Turf, High End, Private Room', contact: '', website: '', multipleEvents: false, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Rehearsal (Off-Site)', name: 'Sangria Bowl', notes: 'Food, cocktails, open late', contact: '', website: 'https://www.thesangriabowl.com/', multipleEvents: false, local: true, budgetFriendly: true, indian: false, chinese: false },

  // Staffing
  { category: 'Staffing', name: 'C&G Events Co', notes: 'High end when caterers don\'t have staff', contact: 'Richard', website: 'https://cngeventrentals.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: true, chinese: true },

  // Tents
  { category: 'Tents', name: 'A Grand Affair', notes: 'Tents', contact: '', website: 'https://grandaffairrental.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Tents', name: 'Select Event Rentals', notes: 'More Expensive / Better Selection', contact: '', website: 'https://selecteventgroup.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Tents', name: 'Signature Event Rentals', notes: 'Tents and other rentals', contact: '', website: 'https://signatureeventrentals.net/', multipleEvents: true, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Tents', name: "Sammy's Rentals", notes: 'Less Selection / Better Price / Clear Tent', contact: '', website: 'http://www.sammysrental.com/', multipleEvents: true, local: false, budgetFriendly: true, indian: false, chinese: false },

  // Transport
  { category: 'Transport', name: 'All Pro Charters', notes: '', contact: '', website: 'https://www.allprocharter.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Transport', name: 'Chariots for Hire', notes: '', contact: '', website: 'https://www.chariotsforhire.com/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Transport', name: 'Fleet Limo', notes: '', contact: '', website: 'https://fleettransportation.com/virginia/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },
  { category: 'Transport', name: 'Virginia Rides', notes: '', contact: '', website: 'https://www.varides.org/', multipleEvents: true, local: false, budgetFriendly: false, indian: false, chinese: false },

  // Videography
  { category: 'Videography', name: 'Annex Room Media', notes: 'Just shot here once, but one of our favorite videos', contact: '', website: 'https://www.annexroommedia.com/', multipleEvents: false, local: false, budgetFriendly: true, indian: false, chinese: false },
  { category: 'Videography', name: 'Olea Films', notes: 'Brighter and lighter', contact: '', website: 'https://www.oleafilms.com/', multipleEvents: true, local: true, budgetFriendly: false, indian: false, chinese: false },
]

// Extract unique categories in display order
export const CATEGORIES = [...new Set(VENDORS.map(v => v.category))]
