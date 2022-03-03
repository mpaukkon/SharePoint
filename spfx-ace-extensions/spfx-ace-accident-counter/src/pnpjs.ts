import {extendFactory} from "@pnp/odata";
import {SPRest} from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web, IWeb } from "@pnp/sp/webs";
import {Accident} from "./adaptiveCardExtensions/types";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { AccidentCounterPropertyPane } from "./adaptiveCardExtensions/accidentCounter/AccidentCounterPropertyPane";
import * as moment from 'moment';
//const moment = require('moment');

declare module "@pnp/sp/webs" {
    interface IWeb{
        getAccidents: (this: IWeb) => Promise<Accident>;
    }
}


extendFactory(Web,
    {
        getAccidents: async function (this: IWeb): Promise<Accident>{
            const today = new Date();
            console.log(today.toISOString());
            const accidents = await this.lists.getByTitle("Accidents").items.filter("AccidentDate lt datetime'"+today.toISOString()+"'").orderBy("AccidentDate",false)<{AccidentDate: Date}[]>();
            console.log(accidents);
            console.log(accidents[0]);
            let month = today.getMonth() +1; 
            let year = today.getFullYear();
            let date = new Date(Date.now());;
            let daysWithoutAccidents: number = Math.ceil((Date.now()-new Date(accidents[0].AccidentDate.toString()).getTime())/(1000*3600*24));

            console.log(accidents[0].AccidentDate);
            let accidentsThisMonth: number  = 0;
            let accidentsThisYear: number = 0;
            accidents.forEach(element => {
                if(moment(element.AccidentDate).isSame(Date.now(),"month"))
                {
                    console.log(element.AccidentDate);
                    accidentsThisMonth++;
                    accidentsThisYear++;
                }
                else if(moment(element.AccidentDate).isAfter(year-1))
                {
                    accidentsThisYear++;
                }
            });


            return {
                daysWithoutAccidents: daysWithoutAccidents,
                accidentsThisMonth: accidentsThisMonth,
                accidentsThisYear: accidentsThisYear
            };
        }

    });

    let _context: AdaptiveCardExtensionContext | null = null;
let _sp: SPRest | null = null;

// a method we can use across the application to get a valid sp object, even when
// we no longer have access to the context, such as within views. This must be called
// the first time from the core ACE class to capture a ref to the context
export function getSP(context: AdaptiveCardExtensionContext = _context): SPRest {

    if (typeof _sp !== "undefined" && _sp !== null) {
        return _sp;
    }

    if (_context === null) {
        _context = context;
    }

    if (typeof _context === "undefined" || _context === null) {
        throw Error("You must call getSP passing the context within the Extension class before using it child views.");
    }

    const sp = new SPRest();

    // setup our sp as needed for this application
    sp.setup({
        spfxContext: context,
        sp: {
            headers: {
                "Accept": "application/json;odata=nometadata",
            },
        },
    });

    _sp = sp;

    return sp;
}