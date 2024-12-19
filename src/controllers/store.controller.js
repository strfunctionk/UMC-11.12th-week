import { StatusCodes } from "http-status-codes";
import {
  bodyToStore,
  bodyToStoreReview,
  bodyToStoreMission,
  bodyToStoreMissionChallenge,
} from "../dtos/store.dto.js";
import {
  storeAddition,
  storeReviewAddition,
  storeMissionAddition,
  storeMissionChallengeAddition,
  listStoreReviews,
  listStoreMissions,
} from "../services/store.service.js";
import { NotSocialError } from "../errors.js";

// 가게 추가
export const handleStoreAddition = async (req, res, next) => {
  /*
 #swagger.summary = '가게 추가 API';
 #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          regionId: { type: "number" },
          name: { type: "string"},
          address: { type: "string" },
          score: {type: "number", format: "float"},
        }
      }
    }
  }
};
 #swagger.responses[200] = {
 description: "가게 추가 성공 응답",
 content: {
 "application/json": {
  schema: {
    type: "object",
    properties: {
      resultType: { type: "string", example: "SUCCESS" },
      error: { type: "object", nullable: true, example: null },
      success: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "number"},
                address: { type: "number" },
                score: { type: "number", format: "float" },
                region: { type: "string" }
              }
            }
          }        
        }
      }
    }
  }
 }
 }
 };
 #swagger.responses[404] = {
 description: "가게 추가 실패 응답",
 content: {
  "application/json": {
    schema: {
      type: "object",
      properties: {
        resultType: { type: "string", example: "FAIL" },
        error: {
          type: "object",
          properties: {
            errorCode: { type: "string", example: "U001" },
            reason: { type: "string" },
            data: { type: "object" }
          }
        },
        success: { type: "object", nullable: true, example: null }
      }
    }
  }
 }
 };
 */
  try {
    console.log("가게 추가를 요청했습니다!");
    console.log("body:", req.body);

    const store = await storeAddition(bodyToStore(req.body));
    res.status(StatusCodes.OK).success(store);
  } catch (err) {
    return next(err)
  }
};

//가게 리뷰 추가
export const handleStoreReviewAddition = async (req, res, next) => {
  /*
#swagger.summary = '가게 리뷰 추가 API';
 #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          storeId: { type: "number" },
          body: { type: "string"},
          score: {type: "number", format: "float"},
          reviewImages: { type: "array", items: { type: "string" } }
        }
      }
    }
  }
};
#swagger.responses[200] = {
description: "가게 리뷰 추가 성공 응답",
content: {
"application/json": {
schema: {
 type: "object",
 properties: {
   resultType: { type: "string", example: "SUCCESS" },
   error: { type: "object", nullable: true, example: null },
   success: {
     type: "object",
     properties: {
       data: {
         type: "array",
         items: {
           type: "object",
           properties: {
             body: { type: "string" },
             score: { type: "number", format: "float" },
             imageUrl: { type: "array", items: { type: "string" }}
           }
         }
       }        
     }
   }
 }
}
}
}
};
#swagger.responses[401] = {
    description: "가게 리뷰 소셜로 접근하지 않음 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U006" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
#swagger.responses[404] = {
description: "가게 리뷰 추가 실패 응답",
content: {
"application/json": {
 schema: {
   type: "object",
   properties: {
     resultType: { type: "string", example: "FAIL" },
     error: {
       type: "object",
       properties: {
         errorCode: { type: "string", example: "U001" },
         reason: { type: "string" },
         data: { type: "object" }
       }
     },
     success: { type: "object", nullable: true, example: null }
   }
 }
}
}
};
*/
  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    console.log("가게에 리뷰 추가를 요청했습니다!");
    console.log("body:", req.body);

    const store = await storeReviewAddition(bodyToStoreReview(req.user, req.body));
    res.status(StatusCodes.OK).success(store);
  } catch (err) {
    return next(err)
  }
};

// 가게 미션 추가
export const handleStoreMissionAddition = async (req, res, next) => {
  /*
#swagger.summary = '가게 미션 추가 API';
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          storeId: { type: "number" },
          reward: { type: "number" },
          deadline: { type: "string", format: "date" },
          missionSpec: {type: "string" }
        }
      }
    }
  }
};
#swagger.responses[200] = {
description: "가게 미션 추가 성공 응답",
content: {
"application/json": {
schema: {
 type: "object",
 properties: {
   resultType: { type: "string", example: "SUCCESS" },
   error: { type: "object", nullable: true, example: null },
   success: {
     type: "object",
     properties: {
       data: {
         type: "array",
         items: {
           type: "object",
           properties: {
             reward: { type: "number" },
             deadline: { type: "string", format: "date" },
             missionSpec: { type: "string"}
           }
         }
       }        
     }
   }
 }
}
}
}
};
#swagger.responses[404] = {
description: "가게 미션 추가 실패 응답",
content: {
"application/json": {
 schema: {
   type: "object",
   properties: {
     resultType: { type: "string", example: "FAIL" },
     error: {
       type: "object",
       properties: {
         errorCode: { type: "string", example: "U001" },
         reason: { type: "string" },
         data: { type: "object" }
       }
     },
     success: { type: "object", nullable: true, example: null }
   }
 }
}
}
};
*/
  try {
    console.log("가게에 미션 추가를 요청했습니다!");
    console.log("body:", req.body);

    const store = await storeMissionAddition(bodyToStoreMission(req.body));
    res.status(StatusCodes.OK).success(store);
  } catch (err) {
    return next(err)
  }
};

// 가게 미션 도전 중인 미션에 추가
export const handleStoreMissionChallengeAddition = async (req, res, next) => {
  /*
#swagger.summary = '가게 미션 도전 중인 미션에 추가 API';
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          missionId: { type: "number" },
          status: {type: "string" }
        }
      }
    }
  }
};
#swagger.responses[200] = {
description: "가게 미션 도전 중인 미션에 추가 성공 응답",
content: {
"application/json": {
schema: {
type: "object",
properties: {
resultType: { type: "string", example: "SUCCESS" },
error: { type: "object", nullable: true, example: null },
success: {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          status: { type: "string"}
        }
      }
    }        
  }
}
}
}
}
}
};
#swagger.responses[400] = {
description: "가게 미션 도전 중인 미션에 추가 이미 도전 중으로 실패 응답",
content: {
"application/json": {
schema: {
type: "object",
properties: {
  resultType: { type: "string", example: "FAIL" },
  error: {
    type: "object",
    properties: {
      errorCode: { type: "string", example: "U005" },
      reason: { type: "string" },
      data: { type: "object" }
    }
  },
  success: { type: "object", nullable: true, example: null }
}
}
}
}
};
#swagger.responses[401] = {
    description: "가게 미션 도전 중인 미션에 추가 소셜로 접근하지 않음 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U006" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
#swagger.responses[404] = {
description: "가게 미션 도전 중인 미션에 추가 id 값 실패 응답",
content: {
"application/json": {
schema: {
type: "object",
properties: {
  resultType: { type: "string", example: "FAIL" },
  error: {
    type: "object",
    properties: {
      errorCode: { type: "string", example: "U001" },
      reason: { type: "string" },
      data: { type: "object" }
    }
  },
  success: { type: "object", nullable: true, example: null }
}
}
}
}
};
*/
  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    console.log("가게의 미션을 도전 중인 미션에 추가를 요청했습니다!");
    console.log("body:", req.body);

    const store = await storeMissionChallengeAddition(bodyToStoreMissionChallenge(req.user, req.body));
    res.status(StatusCodes.OK).success(store);
  } catch (err) {
    return next(err)
  }
};

//가게 리뷰 불러오기
export const handleListStoreReviews = async (req, res, next) => {
  /*
#swagger.summary = '상점 리뷰 목록 조회 API';
#swagger.responses[200] = {
  description: "상점 리뷰 목록 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    body: { type: "string"},
                    score: { type: "number"},
                    storeId: { type: "number"},
                    memberId: { type: "number"},
                    store: { type: "object", properties: { id: { type: "number" }, regionId:{ type: "number" },  name: { type: "string" }, address: { type: "string" }, score: {type: "number", format: "float" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  } } },
                    member: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, gender: { type: "string" }, age: { type: "number" }, address: { type: "string" }, specAddress: { type: "string" }, phoneNum: { type: "string" }, status: { type: "string" }, inactiveDate: { type: "string" }, socialType: { type: "string", format: "date" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  }, email: { type: "string" }, point: { type: "number" }  } }, 
                  }
                }
              },
              pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
            }
          }
        }
      }
    }
  }
};
#swagger.responses[400] = {
  description: "상점 리뷰 목록 조회 커서 초과 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U002" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
#swagger.responses[404] = {
  description: "상점 리뷰 목록 조회 id 값 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U001" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
*/
  try {
    const reviews = await listStoreReviews(
      parseInt(req.params.storeId),
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    return next(err)
  }
};

//가게 미션 불러오기
export const handleListStoreMissions = async (req, res, next) => {
  /*
#swagger.summary = '가게 미션 불러오기 API';
#swagger.responses[200] = {
  description: "가게 미션 불러오기 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    store: { type: "object", properties: { id: { type: "number" }, regionId: { type: "number" }, name: { type: "string" }, address: { type: "string" }, score: {type: "number", format: "float" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  } } },
                    storeId: { type: "number"},
                    reward: { type: "number"},
                    deadline: { type: "string", format: "date" },
                    missionSpec: { type: "string"}
                  }
                }
              },
              pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
            }
          }
        }
      }
    }
  }
};
#swagger.responses[400] = {
  description: "가게 미션 불러오기 조회 커서 초과 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U002" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
#swagger.responses[404] = {
  description: "가게 미션 불러오기 조회 id 값 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U001" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
*/
  try {
    const missions = await listStoreMissions(
      parseInt(req.params.storeId),
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(missions);

  } catch (err) {
    return next(err)
  }
};