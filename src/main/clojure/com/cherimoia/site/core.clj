;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013 Cherimoia, LLC. All rights reserved.


(ns  ^{ :doc ""
        :author "kenl" }

  com.cherimoia.site.core

  (:require [clojure.tools.logging :as log :only (info warn error debug)])
  (:require [clojure.string :as cstr])
  (:require [clojure.data.json :as json])
  (:use [cmzlabsclj.tardis.core.constants])
  (:use [cmzlabsclj.tardis.core.wfs])
  (:use [cmzlabsclj.nucleus.util.str :only [strim] ])

  (:import ( com.zotohlabs.wflow FlowPoint Activity
                                 Pipeline PipelineDelegate PTask Work))
  (:import (com.zotohlabs.gallifrey.io HTTPEvent HTTPResult Emitter))
  (:import (com.zotohlabs.frwk.net ULFormItems ULFileItem))
  (:import (com.zotohlabs.frwk.io XData))
  (:import (com.zotohlabs.wflow.core Job))
  (:import (java.util HashMap Map)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(deftype MyAppMain [] cmzlabsclj.tardis.impl.ext.CljAppMain

  (contextualize [_ container]
    (log/info "My AppMain contextualized by container " container))
  (configure [_ options]
    (log/info "My AppMain configured with options " options))
  (initialize [_]
    (log/info "My AppMain initialized!"))
  (start [_]
    (log/info "My AppMain started"))
  (stop [_]
    (log/info "My AppMain stopped"))
  (dispose [_]
    (log/info "My AppMain finz'ed")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowLandingPage ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [ ^String tpl (:template (.getv job EV_OPTS))
             ^HTTPEvent evt (.event job)
             ^Emitter src (.emitter evt)
             ^cmzlabsclj.tardis.impl.ext.ContainerAPI
             co (.container src)
             [rdata ct] (.loadTemplate co tpl (HashMap.))
             ^HTTPResult res (.getResultObj evt) ]
        (.setHeader res "content-type" ct)
        (.setContent res rdata)
        (.setStatus res 200)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- handleContactMsg ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [
             jsonE { :status false :msg "Error while submitting your message." }
             jsonG { :status true :msg "Thank you." }
             ^HTTPEvent evt (.event job)
             data (-> (.data evt)(.content))
             ^HTTPResult res (.getResultObj evt) ]

        (.setHeader res "content-type" "application/json")
        (cond
          (instance? ULFormItems data)
          (let [ itms (.asMap ^ULFormItems data)
                 n (.get itms "userHuman")
                 s (strim (if (nil? n) "" (.getString n))) ]
            (if (= s "38")
                (.setContent res (XData. (json/write-str jsonG)))
                (.setContent res (XData. (json/write-str jsonE)))))
          :else
          (.setContent res (XData. (json/write-str jsonE))))
        (.setStatus res 200)
        (.replyResult evt)))

  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LandingHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'com.cherimoia.site.core)
    (doShowLandingPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ContactHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'com.cherimoia.site.core)
    (handleContactMsg))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)


