import React from "react";
import Turnout from "./njturnout";
import "./style.css";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.colorPickerRef = React.createRef();
  }
  componentDidMount = () => {
    var ctx =
      this.colorPickerRef &&
      this.colorPickerRef.current &&
      this.colorPickerRef.current.getContext("2d");
    if (ctx) {
      ctx.lineTo(100, 0);
      ctx.lineTo(100, 100);
      ctx.lineTo(0, 100);
      ctx.fillStyle = "rgb(150,100,200)";
      ctx.fill();
    }
  };
  /*
  He believes compound interest and collateral repossession
            instead of industry assessment, as in payday loans, surrenders the
            purchases of others, a violation in contract law; and contracts
            generally are bonk in liberty but for shares and voting:{" "}
            {/*meanwhile, to never surrender that which is
            not yours in contract law means shares and voting are grounds, not
            compound interest, collateral repossession, nor implausible use
            leases, while in communism, * /}
            invoices/bills are banned. 
  */
  render() {
    const space = " ";
    return (
      <div
        style={{
          fontFamily: "'Pacifico', sans-serif",
          maxWidth: "600px",
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            textAlign: "center",
            bottom: "0px",
            width: "100%",
            padding: "10px 0px",
            position: "fixed",
            backgroundColor: "black",
            color: "white"
          }}
        >
          sayists@icloud.com
        </div>
        <canvas ref={this.colorPickerRef} height="100%" width="100px"></canvas>
        <div
          style={{
            position: "relative",
            width: "calc(100% - 60px)",
            maxWidth: "300px"
          }}
        >
          <img
            style={{
              border: "25px solid rgb(170,120,220)",
              borderBottom: "70px solid rgb(170,120,220)",
              width: "100%"
            }}
            alt="Nick Carducci portrait"
            src="https://www.dropbox.com/scl/fi/xpju5ywam09gpomqkqxkh/portrait_Carducci.jpg?rlkey=qsi2213tnf6eadilxkbaoe7gh&raw=1"
          />
          <div
            style={{
              fontSize: "15px",
              textAlign: "right",
              left: "50px",
              bottom: "20px",
              position: "absolute",
              backgroundColor: "rgb(170,120,220)",
              color: "white"
            }}
          >
            <a
              style={{
                color: "white"
              }}
              href="https://change.org/nickcarducci"
            >
              Sign the petition
            </a>
            {space}Bankruptcy is Fraud
            <br />
            <a
              style={{
                color: "white"
              }}
              href="https://account.venmo.com/u/truncatedwholesaletax"
            >
              Donate today
            </a>
          </div>
        </div>
        <div
          style={{
            margin: "5px"
          }}
        >
          <h2>Retire, refine, remit!</h2>
          <h3
            style={{ color: "grey" }}
            //Medicaid for Transplants, Retirees pay SSA.
          >
            New Candidate: Free Rider Mutable Taxes make China and Russia
            interested in Taiwan and Ukraine; Geohash Descriptor Protocol
          </h3>
          <span>
            Nicholas Matthew Carducci is running for Senate with a new tax
            policy to{space}
            <span
              style={{
                backgroundColor: "rgba(150,250,200,.7)"
              }}
            >
              retire social security where income taxes lower by 1/78th annually
              (Would young people rather make a deal to end FICA income tax
              minimums? Can income taxes be lowered by 1/78 annually while
              fulfilling $23t social security liabilities, 2023?)
            </span>
            <span
              style={{
                display: "none",
                backgroundColor: "rgba(240,230,180,.7)"
              }}
            >
              social security liabilities can be paid by wealthy retirees
              instead of an income tax (even a guaranteed minimum income)
            </span>
            ,{space}
            <span
              style={{
                backgroundColor: "rgba(250,170,200,.7)"
              }}
            >
              refine Medicaid where the Hippocratic Oath, namely for sutures and
              natal care, is to replace most of medicaid, less transplants
              (without medicaid inpatient standardized guarantee schemes)
            </span>
            , and he wants to{space}
            <span
              style={{
                backgroundColor: "rgba(210,180,250,.7)"
              }}
            >
              end the fed where the Federal Reserve should be the only lender;
              he wants the central bank to pay for any deficit, while tax rates
              rise to remit the year before (Is a continuing resolution with a
              deficit constitutional? Are growing interest payments uniform?
              Article 1 Section 8).
            </span>
            {space}He generally leans right on government spending and left on
            monopolies (Do all concert and sport event tickets originate with
            Ticketmaster? How can a developer partner? Are venues the real
            monopolies?), wanting very easy immigration policies (yet doesn't
            mind a border), hating unemployment benefits (as corporate welfare),
            and calling for depositary- instead of depository-banking (so
            commercial banks do not lend deposits).{space}
            <span
              style={{
                backgroundColor: "black",
                color: "white"
              }}
            >
              Bills surrender the right to own of third party donee
              beneficiaries. Debt should be paid by industry, instead of late
              fees. Student loans by degree, and mortgages auction borrower
              equity.
            </span>
            {space}
            <i>
              Was the 2022 federal deficit $1.4t or $2.8t expenditures less
              receipts?
            </i>
            {space}Consumer, government, and some corporate debt is not only
            unsustainable but it’s inflationary (Are rising real product wages
            inflationary?), while industry recourse royalty is potentially
            materially beneficial or deflationary, wholesale collectives do not
            bargain when doctors’ appointments overbook and pharmaceutical deals
            expire, and make the central bank the only lender of bills, no
            bonds. He thinks shrinkflation causes growth, and interest payments
            need new money from quantitative easing to work.
            {
              space +
                space /*
                it would take multiple lifetimes to
            tax enough to seriously address the public debt problem so he would
            confiscate bonds to pay off social security liabilities and lessen
            the tax rate annually, and 
                
                He thinks the income and inheritance tax can be replaced by a wealth
            tax based on age, and the $21t social security liabilities can be
            retired in a lifetime ($21t/57m=$368,421). He thinks deflation is
            good, and insurance and bills surrender the purchases of third
            parties. */
            }
            <span
              style={{
                backgroundColor: "rgba(150,200,250,.7)"
              }}
            >
              In order to run for office under the banner-slogan “Risk-Free
              Banking”,
              {
                space
                /**He doesn't understand how real GDP
          growth is non-zero and thinks deflation is better than just
          disinflation.  */
              }
              <i>
                Nick Carducci needs 742 more signatures! He would prefer to
                {space}
                <b>discharge</b>
                {space}student debt to bailouts, as well as liquidate compound
                interest, that is: end unemployment benefits, rentals, debt, and
                insurance, or finance, overall.
              </i>
            </span>
          </span>
          <br />
          <br />
          <span>
            He’s earned a political science bachelor degree JHU with an
            economics minor in 2015,{space}
            <i>
              as well as learned public finance and international law at
              Monmouth University
            </i>
            . He is the product manager of Thumbprint.us social calendar,
            Quick.net.co bookkeeping facility, Vaults.biz industry assessment,
            and Scopes.cc contract manager. He also invented a voting system
            that allows for anonymous voting.
            <br />
            <br />
            His opponent incumbent Bob Menendez has been tried twice for bribery
            (How did Bob Menendez persuade the insurance fraud prosecutor to
            resolve the prosecution more favorably to the defendant Uribe
            without jail time nor charges? What kind of pressure was applied as
            supervisor in 2019?) and has an animal rights policy stance for
            horses that stops short for lab rats{space}
            <i>with the human right to try without prescriptions.</i>
            {space}
            He thinks Trump should have gotten a permit for his own rally-riot
            and is guilty of knowing{space}
            <a href="https://thumbprint.us" style={{ color: "black" }}>
              current election technology is unprovable
            </a>
            {space}unless he says erroneously, "elections are auditable" and
            requests a recount. He thinks the employee retention and paycheck
            protection program was free labor, and unemployment benefits are
            unfair to workers and savers. He says a "national sales tax" means
            no business and real property deductions, just gift tax exemptions.
          </span>
          <br />
          <br />
          He says we will likely win because 65% supported Occupy Wall Street;
          that's 95% among non-voters.
          {/* Military - 12%, Interest - 5%. Social
          Security - 26%, Medicaid/Medicare - 26%, Veterans Income Security -
          17%*/}
          <Turnout
            lastWidth={Math.min(600, this.props.width)}
            style={{
              paddingBottom: "15px",
              backgroundColor: "rgb(190,150,180)"
            }}
          />
          <div
            style={{
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              fontSize: "15px",
              textAlign: "right",
              left: "50px",
              bottom: "20px",
              backgroundColor: "black",
              color: "white"
            }}
          >
            NO RECOURSE LOANS
            <img
              src="https://www.dropbox.com/s/8yxi9s12uwgz6lv/thumbprint_starter.png?raw=1"
              style={{
                width: "30px"
              }}
              alt="thumbprint logo"
            />
            <a
              style={{
                color: "white"
              }}
              href="https://bankingisnot.biz"
            >
              Bankingisnot.Biz
            </a>
          </div>
          <span>
            He aspires to deflate the economy and retire low unemployment
            forever with technology{space}
            <i>
              and fiscal policy to cut out compound interest in order to make
              balancing the budget at most an annual deficit
            </i>
            . Earlier than a certain point (NAIRU) on the Phillips curve of
            unemployment (x) to prices (y), employment is no longer deflationary
            (Is joblessness or unemployment a problem due to benefits costs? Do
            small businesses get unemployment benefits? Do unemployment benefits
            come from third party taxpayers and savers? Where does the
            government get its money?).
          </span>
          <br />
          <br />
          <span>
            Although he is running for a federal position, he thinks state
            government is free rider mutable other than suiting-plaintiffs;
            sales tax can be supported by a geohash-descriptors for accounting
            software. He believes in a single-party divorce and tort reform,
            whereas the fault is of a right to try. Nick also wants to force
            politicians to abstain from voting when they have above $100k share
            ownership in a government contractor to benefit.
          </span>
          <span style={{ display: "none" }}>
            He says non-voters reconcile past budgets, by default, and
            shrinkflation erroneously causes economic growth, so GDP growth per
            capita is abnormal, nor natural and neutral. Finally, he postulates
            a 3% return per dollar-checking by current revenuedata.doi.gov. He
            wants a bank that doesn't lend his deposits, where
            {space}
            <i>
              depositaries instead function for a one-time fee as a receipt of
              the consortium.
            </i>
          </span>
          <span style={{ display: "none" }}>
            Student debt is owned by the treasury, garnishes social security,
            and compounds interest for late fees - but{space}
            <b>
              without bailouts and for payday loans you only pay when you start
              working in the industry your degree is in
            </b>
            .{space}
            <i>
              We will not default because current dollars would return 3% given
              current drilling in WY, NM, and UT public lands.
            </i>
            {space}He wants Hryvnia for U.S. arms dealing. He is starting Saver
            Party (saverparty.com or taxparty.org) for resource conservation. He
            thinks student debt should be assessed to recourse by industry
            merchant category code like business for sales, and communications
            for marketing.
            <br />
            <br />
            Compound interest is an unnecessary recourse against the freedom of
            other's purchasing conveyance. He advises to liquidate
            collateralized and limited partnership foundation assets before
            default, and under default he will make the borrower the equity
            holder, and the mortgage lien-holder a mere realtor.
            <br />
            <br />
            Landlords are "rent-seekers" above five 1 bathroom units,
            office-floors, and storefronts; without this surrender, prices would
            be much less than 9x to build to buy, he says{space}
            <a href="https://fred.stlouisfed.org/graph/?g=18ELw">
              (price/((average hourly earnings*hours worked)/employees))
            </a>
            .
          </span>
          {/*Do you prefer a truncated progressive tax to a flat tax? Savings in
        public parks of UT, WY, NM lands, resources, and reserves.
        even by age with
            implementation difficulties*/}
          <span style={{ display: "none" }}>
            He wants to pay back SSA over a lifetime, by age, with a wealth tax
            for retirees; then, he would move us to truncated progressive tax
            $60-600,{space}
            <a
              href="https://fred.stlouisfed.org/graph/?g=17fkn"
              style={{ color: "black" }}
            >
              after deflation to 1950's level
            </a>
            .
          </span>
          <br />
          <br />
          <span style={{ display: "none" }}>
            He supports{space}
            <b>regulating monopolies, not prices</b>. He says we will have to
            pay back Social Security to in a lifetime because{space}
            <a
              href="https://www.quora.com/unanswered/Should-we-pay-back-social-security-in-a-lifetime-starting-now-and-end-income-taxes-for-a-flat-or-truncated-progressive-tax"
              style={{ color: "black" }}
            >
              that’s how it’s taken in
            </a>
            .
            <h3 style={{ color: "grey" }}>
              Insurance is elastic towards price for expiring and overbooking
              wholesale collective bargaining like money is. Now short-term
              rentals are limited, admitting some quantity instead of price
              monopoly of build to sell - implausible use leases landlord
              liquidity Microfinance blackrock.
            </h3>
            <i>
              He wants to force landlords to sell and doctors to oath private
              practice sutures, obstetrics, and transplants for free.
            </i>
            {space}Landlords get 5 condos, stores, and/or office-floors maximum,
            he says, because implausible use is rent-seeking. You can still own
            as much as you want, without property-tax, as sewage and trash
            removal are free rider mutable.{space}
            <i>
              He wants to force sutures (including obstetrics and maybe
              transplants) for medical private practitioners as Medics for all,
              not tax single payer, bills Medicare for all, nor universal
              healthcare fines.
            </i>
          </span>
          He believes the birth rates a lifetime ago made the Holodomor, the
          Great Leap Forward (80m/(1950-1928) == 3m/year * 5 years == 15m),
          Covid, and will make another “pandemic” in 2025 by two periods of 20%
          increases 5 years apart.
          <a
            href="https://humanharvest.info"
            style={{
              backgroundColor: "forestgreen",
              color: "white"
            }}
          >
            humanharvest.info
          </a>
          <iframe
            src="https://humanharvest.info"
            title="human harvest info"
            style={{
              height: "300px",
              width: "100%",
              border: "0px solid"
            }}
          />
          He wants to save borrowers from foreclosure by making lenders sell for
          them with a realtor commission, or refinance if lower.
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}
export default App;

