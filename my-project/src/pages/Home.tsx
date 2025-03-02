import styles from "./Home.module.css";

export interface IHomeProps {
  className?: string;
}

export const Home = ({ className, ...props }: IHomeProps): JSX.Element => {
  return (
    <div className={styles.home + " " + className}>
      <div className={styles.main}>
        <div
          className={styles.element}
          style={{
            background: "url(/assets/home.jpg) center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className={styles.link}>
            <div className={styles.letUsGuideYourHome}>
              LET US GUIDE YOUR HOME{" "}
            </div>
          </div>
          <div className={styles.heading2BelieveInFindingIt}>
            Believe in finding it{" "}
          </div>
          <div className={styles.searchPropertiesForSaleAndToRent}>
            Search properties for sale and to rent{" "}
          </div>
          <div className={styles.form}>
            <div className={styles.input}></div>
            <div className={styles.input2}>
              <div className={styles.enterNameKeywords}>
                Enter Name, Keywords...{" "}
              </div>
            </div>
            <div className={styles.button}>
              <img className={styles.icon} src="icon0.svg" />
            </div>
          </div>
          <div className={styles.element2}>
            <div className={styles.navigationList}>
              <div className={styles.itemLink}>
                <div className={styles.home2}>Home </div>
                <div className={styles.after}></div>
              </div>
              <div className={styles.itemLink2}>
                <div className={styles.listings}>Listings </div>
                <div className={styles.after2}></div>
              </div>
              <div className={styles.itemLink3}>
                <div className={styles.groups}>Groups </div>
                <div className={styles.after3}></div>
              </div>
              <div className={styles.itemLink4}>
                <div className={styles.blog}>Blog </div>
                <div className={styles.after4}></div>
              </div>
            </div>
            <div className={styles.link2}></div>
            <div className={styles.link3}>
              <img className={styles.icon2} src="icon1.svg" />
            </div>
            <div className={styles.link4}>
              <div className={styles.login}>Login </div>
            </div>
            <div className={styles.flatClub}>Flat Club </div>
          </div>
        </div>
        <div className={styles.featuredProperties}>Featured Properties </div>
        <div className={styles.loremIpsumDolorSitAmetConsecteturAdipiscingElit}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
        </div>
        <div className={styles.list}>
          <div className={styles.itemLink5}>
            <div className={styles.allProperties}>All Properties </div>
          </div>
          <div className={styles.itemLinkForSale}>For Sale </div>
          <div className={styles.itemLinkForRent}>For Rent </div>
        </div>
        <div className={styles.article}>
          <div className={styles.divPropertyThumbnailWrapper}>
            <img
              className={styles.linkP11500X500Jpg}
              src="link-p-11-500-x-500-jpg0.png"
            />
            <div className={styles.link5}>
              <div className={styles.forSale}>For Sale </div>
            </div>
            <div className={styles.spanFeaturedProperty}>
              <div className={styles.featured}>Featured </div>
            </div>
          </div>
          <div className={styles.divPropertyInformation}>
            <div className={styles.heading2LinkLuxuryFamilyHome}>
              Luxury Family Home{" "}
            </div>
            <img className={styles.icon3} src="icon2.svg" />
            <div className={styles.link1800181879thSt}>1800-1818 79th St </div>
            <div className={styles.two195000Zl}>2,195,000 zl </div>
          </div>
        </div>
        <div className={styles.article2}>
          <div className={styles.divPropertyThumbnailWrapper}>
            <img
              className={styles.linkP13500X500Jpg}
              src="link-p-13-500-x-500-jpg0.png"
            />
            <div className={styles.link5}>
              <div className={styles.forRent}>For rent </div>
            </div>
          </div>
          <div className={styles.divPropertyInformation}>
            <div className={styles.heading2LinkSkyperPoolApartment}>
              Skyper Pool Apartment{" "}
            </div>
            <img className={styles.icon4} src="icon3.svg" />
            <div className={styles.link1020BloomingdaleAve}>
              1020 Marsz Ave{" "}
            </div>
            <div className={styles.five000Zl}>5000 zl </div>
            <div className={styles.month}>/month </div>
          </div>
        </div>
        <div className={styles.article3}>
          <div className={styles.divPropertyThumbnailWrapper}>
            <img
              className={styles.linkP15500X500Jpg}
              src="link-p-15-500-x-500-jpg0.png"
            />
            <div className={styles.link6}>
              <div className={styles.forRent2}>For Rent </div>
            </div>
          </div>
          <div className={styles.divPropertyInformation}>
            <div className={styles.heading2LinkNorthDillardStreet}>
              North Dillard Street{" "}
            </div>
            <img className={styles.icon5} src="icon4.svg" />
            <div className={styles.link4330BellShoalsRd}>
              4330 Bell Shoals Rd{" "}
            </div>
            <div className={styles.five000Zl2}>5000 zl </div>
            <div className={styles.month2}>/month </div>
          </div>
        </div>
        <div className={styles.article4}>
          <div className={styles.divPropertyThumbnailWrapper}>
            <img
              className={styles.linkP16500X500Jpg}
              src="link-p-16-500-x-500-jpg0.png"
            />
            <div className={styles.link5}>
              <div className={styles.forSale}>For Sale </div>
            </div>
            <div className={styles.spanFeaturedProperty}>
              <div className={styles.featured}>Featured </div>
            </div>
          </div>
          <div className={styles.divPropertyInformation}>
            <div className={styles.heading2LinkEatonGarthPenthouse}>
              Eaton Garth Penthouse{" "}
            </div>
            <img className={styles.icon6} src="icon5.svg" />
            <div className={styles.link772218thAveBrooklyn}>
              7722 18th Ave, Warsaw{" "}
            </div>
            <div className={styles.five000Zl3}>5000 zl </div>
            <div className={styles.month3}>/month </div>
          </div>
        </div>
        <div className={styles.article5}>
          <div className={styles.divPropertyThumbnailWrapper}>
            <img
              className={styles.linkP17500X500Jpg}
              src="link-p-17-500-x-500-jpg0.png"
            />
            <div className={styles.link6}>
              <div className={styles.forRent2}>For Rent </div>
            </div>
            <div className={styles.spanFeaturedProperty2}>
              <div className={styles.featured}>Featured </div>
            </div>
          </div>
          <div className={styles.divPropertyInformation}>
            <div className={styles.heading2LinkNewApartmentNiceWiew}>
              New Apartment Nice Wiew{" "}
            </div>
            <img className={styles.icon7} src="icon6.svg" />
            <div className={styles.link42AvenueOBrooklyn}>
              42 Avenue O, Gdansk{" "}
            </div>
            <div className={styles.six000Zl}>6000 zl </div>
            <div className={styles.month4}>/month </div>
          </div>
        </div>
        <div className={styles.article6}>
          <div className={styles.divPropertyThumbnailWrapper}>
            <img
              className={styles.linkP18500X500Jpg}
              src="link-p-18-500-x-500-jpg0.png"
            />
            <div className={styles.link5}>
              <div className={styles.forSale}>For Sale </div>
            </div>
            <div className={styles.spanFeaturedProperty}>
              <div className={styles.featured}>Featured </div>
            </div>
          </div>
          <div className={styles.divPropertyInformation}>
            <div className={styles.heading2LinkDiamondManorApartment}>
              Diamond Manor Apartment{" "}
            </div>
            <img className={styles.icon8} src="icon7.svg" />
            <div className={styles.link780220thAveBrooklyn}>
              7802 20th Ave, Gdynia{" "}
            </div>
            <div className={styles.five000Zl4}>5000 zl </div>
            <div className={styles.month5}>/month </div>
          </div>
        </div>
        <div className={styles.link7}>
          <div className={styles.seeAllListing}>See All Listing </div>
          <img className={styles.svg} src="svg0.svg" />
        </div>
        <div className={styles.element3}>
          <div className={styles.heading2FindPropertiesInTheseCities}>
            Find Properties in These Cities{" "}
          </div>
          <div
            className={styles.loremIpsumDolorSitAmetConsecteturAdipiscingElit2}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
          </div>
        </div>
        <div className={styles.element4}>
          <div className={styles.divSlickList}>
            <div
              className={styles.tabpanelLink}
              style={{
                background: "url(tabpanel-link0.png) center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className={styles.before}></div>
              <div className={styles.frame1}></div>
              <div className={styles.heading4Chicago}>Warsaw </div>
              <div className={styles.one20Properties}>120 Properties </div>
            </div>
            <div className={styles.tabpanelLink2}>
              <div
                className={styles.h23Jpg}
                style={{
                  background: "url(h-23-jpg0.png) center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img
                  className={styles.six60KatedraWMikoAjaFotUmElblag1}
                  src="_660-katedra-w-miko-aja-fot-um-elblag-10.png"
                />
              </div>
              <div className={styles.before}></div>
              <div className={styles.heading4LosAngeles}>Elbląg </div>
              <div className={styles.two1Property}>21 Property </div>
            </div>
            <div className={styles.tabpanelLink3}>
              <div
                className={styles.h24Jpg}
                style={{
                  background: "url(h-24-jpg0.png) center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img
                  className={styles.adobeStock1299427551}
                  src="adobe-stock-129942755-10.png"
                />
              </div>
              <div className={styles.before}></div>
              <div className={styles.heading4Miami}>Gdansk </div>
              <div className={styles.seven2Properties}>72 Properties </div>
            </div>
            <div className={styles.tabpanelLink4}>
              <div
                className={styles.h25Jpg}
                style={{
                  background: "url(h-25-jpg0.png) center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img className={styles.krk1} src="krk-10.png" />
              </div>
              <div className={styles.before}></div>
              <div className={styles.heading4Florida}>Krakow </div>
              <div className={styles.nine3Properties}>93 Properties </div>
            </div>
            <div className={styles.tabpanelLink5}>
              <div
                className={styles.h21Jpg}
                style={{
                  background: "url(h-21-jpg0.png) center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img className={styles.wrc1} src="wrc-10.png" />
              </div>
              <div className={styles.before}></div>
              <div className={styles.heading4NewYork}>Wrocław </div>
              <div className={styles.six8Properties}>68 Properties </div>
            </div>
          </div>
          <div className={styles.tablist}></div>
        </div>
        <div className={styles.heading2}></div>
        <div className={styles.element5}>
          <div className={styles.divEConInner}>
            <div className={styles.divElementorElement}>
              <div className={styles.flatClub2}>Flat Club </div>
              <div className={styles.link8}>
                <img className={styles.svg2} src="svg1.svg" />
              </div>
            </div>
            <div className={styles.form2}></div>
            <div className={styles.list2}></div>
            <div className={styles.heading2QuickLinks}>Quick Links </div>
            <div className={styles.list3}>
              <div className={styles.itemLinkAbout}>About </div>
              <div className={styles.itemLinkContact}>Contact </div>
              <div className={styles.itemLinkFaqS}>FAQ’s </div>
              <div className={styles.itemLinkBlog}>Blog </div>
              <div className={styles.itemLinkPricingPlans}>Pricing Plans </div>
              <div className={styles.itemLinkPrivacyPolicy}>
                Privacy Policy{" "}
              </div>
              <div className={styles.itemLinkTermsConditions}>
                Terms &amp; Conditions{" "}
              </div>
            </div>
            <div className={styles.heading2ContactUs}>Contact Us </div>
            <div className={styles.hiJusthomeCom1234567890}>
              hi@justhome.com
              <br />
              (123) 456-7890{" "}
            </div>
            <div className={styles.heading2OurAddress}>Our Address </div>
            <div className={styles.nine9FifthAvenue3rdFloorSanFranciscoCa1980}>
              99 Fifth Avenue, 3rd Floor
              <br />
              San Francisco, CA 1980{" "}
            </div>
            <div className={styles.divElementorElement2}>
              <div className={styles.copyright2024FlatClub}>
                Copyright © 2024. Flat Club{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
