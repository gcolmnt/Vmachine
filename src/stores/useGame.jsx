import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
{

    return {
        
        /**
         * Time
         */
                startTime: 0,
                endTime: 0,
        

        /**
         * Phases
         */
        phase: 'wait',

        /**
         * Orbit control
         */
        orbitOff: false,


        travelIn: () =>
        {
            set((state) =>
            {
                if(state.phase === 'wait')
                return { phase: 'goToDigit', orbitOff: true }
                return{}
            })
        },

        ready: () =>
        {
            set((state) =>
            {
                if(state.phase === 'goToDigit')
                return { phase: 'prepared' }
                return{}
            })
        },

        start: () =>
        {
            set((state) =>
            {
                if(state.phase === 'prepared')
                return { phase: 'playing', startTime: Date.now() }
                return{}
            })
        },

        end: () =>
        {
            set((state) =>
            {
                if(state.phase === 'playing')  
                    return { phase: 'ended' }

                return {}
            })
        },

        travelOut: () =>
        {
            set((state) =>
            {
                if(state.phase === 'ended')  
                    return { phase: 'goToReward' }

                    return{}
            })
        },

        reward: () =>
        {
            set((state) =>
            {
                if(state.phase === 'goToReward')  
                    return { phase: 'rewarding', orbitOff: false }

                    return{}
            })
        },

        restart: () =>
        {
            set((state) =>
            {
                if(state.phase === 'rewarding')  
                    return { phase: 'wait' }

                    return{}
            })
        },

    }
}))
