import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RandomNumberView from '../views/RandomNumberView.vue'
import RandomStringView from '../views/RandomStringView.vue'
import RouletteView from '../views/RouletteView.vue'
import CaseConvertView from '../views/CaseConvertView.vue'
import JsonFormatView from '../views/JsonFormatView.vue'
import ColorConvertView from '../views/ColorConvertView.vue'
import TimestampConvertView from '../views/TimestampConvertView.vue'
import BaseConvertView from '../views/BaseConvertView.vue'
import StorageConvertView from '../views/StorageConvertView.vue'
import DataRateConvertView from '../views/DataRateConvertView.vue'
import GeneralConvertView from '../views/GeneralConvertView.vue'
import BMIView from '../views/BMIView.vue'
import DateDiffView from '../views/DateDiffView.vue'
import AgeCalculateView from '../views/AgeCalculateView.vue'
import FibonacciView from '../views/FibonacciView.vue'
import PrimesView from '../views/PrimesView.vue'
import SumOddEvenView from '../views/SumOddEvenView.vue'
import InfoView from '../views/InfoView.vue'
import FeedbackView from '../views/FeedbackView.vue'
import NotFound from '../views/NotFound.vue'
import ServerError from '../views/ServerError.vue'
import ComingSoon from '../views/ComingSoon.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/random-numbers', name: 'randomNumbers', component: RandomNumberView },
        { path: '/random-strings', name: 'randomStrings', component: RandomStringView },
        { path: '/roulette', name: 'roulette', component: RouletteView },
        { path: '/case-convert', name: 'caseConvert', component: CaseConvertView },
        { path: '/json-format', name: 'jsonFormat', component: JsonFormatView },
        { path: '/color-convert', name: 'colorConvert', component: ColorConvertView },
        { path: '/timestamp-convert', name: 'timestampConvert', component: TimestampConvertView },
        { path: '/base-convert', name: 'baseConvert', component: BaseConvertView },
        { path: '/storage-convert', name: 'storageConvert', component: StorageConvertView },
        { path: '/data-rate-convert', name: 'dataRateConvert', component: DataRateConvertView },
        { path: '/general-convert', name: 'generalConvert', component: GeneralConvertView },
        { path: '/bmi', name: 'bmi', component: BMIView },
        { path: '/date-diff', name: 'dateDiff', component: DateDiffView },
        { path: '/age-calculate', name: 'ageCalculate', component: AgeCalculateView },
        { path: '/fibonacci', name: 'fibonacci', component: FibonacciView },
        { path: '/primes', name: 'primes', component: PrimesView },
        { path: '/sum-odd-even', name: 'sumOddEven', component: SumOddEvenView },
        { path: '/info', name: 'info', component: InfoView },
        // { path: '/ai-tool', name: 'ai-tool', component: ComingSoon, meta: { title: 'AI Tools', desc: 'AI Tools Coming Soon...' } }
        { path: "/feedback", name: "Feedback", component: FeedbackView },
        { path: '/:pathMatch(.*)*', name: 'NotFound',component: NotFound },
        { path: '/500', name: 'ServerError', component: ServerError },
    ]
})

export default router